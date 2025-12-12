# Migration Guide: Prisma/PostgreSQL → PHP/MySQL

This document outlines the recommended steps to migrate your Next.js/Prisma/Postgres application into a static Next.js frontend with a PHP/MySQL backend, and to deploy via FTP using GitHub Actions.

Steps overview:

1. Database: Import provided MySQL dump

   - If your target is the MySQL database indicated below, import the `annts.sql` file:

   ```bash
   mysql -h <DB_HOST> -P <DB_PORT> -u myczroxg_david -p myczroxg_annhurst < annts.sql
   # it will prompt for your password; use the password provided for the DB user
   ```

   - If your dump is a PostgreSQL dump, convert it using `pgloader` or export to a compatible SQL.

2. Turn Off Prisma / Move API to PHP

   - Remove or avoid using server-side API routes from Next.js that require Node.
   - Re-implement API backend in `backend-php/` using PHP + PDO, or extend its sample to cover `inspections`, `payments`, `buses`, `drivers`, etc.

3. Environment variables and secrets

   - Configure the following environment variables on your hosting provider or via secure settings:
     - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
   - For GitHub Actions, add FTP secrets in your repository settings under `Settings → Secrets → Actions`:
     - `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_PORT`

4. Mapping Prisma models to PHP queries

   - For each Prisma model in `prisma/schema.prisma`, add SQL tables and create corresponding PHP handlers.
   - Example: convert Prisma `Contact` model to SQL `contacts` table and create `contacts.php` that uses PDO prepared statements.

5. Frontend setup

   - If you can export a static Next.js site using `next export`, the deployment action will copy `out/` and deploy it to your FTP host. Otherwise, deploy static assets only (e.g., `public/`) or host the frontend separately (e.g., Vercel).

6. Testing locally

   - Run a local MySQL database or Docker container for testing:

   ```bash
   docker run --name mysql-test -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=myczroxg_annhurst -e MYSQL_USER=myczroxg_david -e MYSQL_PASSWORD=AnnhurstDavid123# -p 3306:3306 -d mysql:8
   mysql -h 127.0.0.1 -P 3306 -u myczroxg_david -p myczroxg_annhurst < annts.sql
   ```

7. Deploying via GitHub Actions (FTP)

   - Add the secrets to GitHub (FTP credentials) and ensure your hosting server accepts FTP/FTPS.
   - The included workflow (.github/workflows/deploy-ftp.yml) will build the frontend and upload `out/` or `public/`, plus the `backend-php` folder. Adjust `server-dir` and other parameters as needed.

8. Post-migration

   - Validate each API route, check data integrity, and remove or archive the old Prisma/Postgres code.
   - Optionally, you can keep Prisma as an admin-only DB abstraction if you run Node elsewhere, but it won't run on a PHP-only host.

   9. Authentication changes

   - The backend now uses a simple JWT/`Authorization: Bearer` token approach. The PHP endpoint `/api/auth/login` returns a token; the frontend should store it in `localStorage` and include `Authorization: Bearer <token>` in subsequent requests to protected endpoints.
   - A convenience endpoint `/api/auth/me` returns the current user object based on the provided token. Replace NextAuth calls and `useSession` with a client `AuthContext` that posts to `/api/auth/login`, stores the token, and fetches `/api/auth/me` to load user data.

Notes & Recommendations

- Always backup the current DB before importing or overwriting data.
- If you have many Prisma data types or complex queries, migrate them systematically: implement endpoints and test slowly (unit/integration tests recommended).
- Consider whether your hosting supports Node.js if you want to keep Next.js server features. If not, convert these features to static HTML or to the PHP backend.
