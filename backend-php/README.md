# PHP Backend for Annhurst App

This `backend-php` folder contains a minimal PHP backend scaffold that demonstrates how to serve an API using MySQL.

Files:
- `db.php` - PDO MySQL connection helper that reads from environment variables: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_PORT`.
- `contacts.php` - Example API endpoint for listing and creating contacts.
- `index.php` - Minimal router mapping `/contacts` requests to `contacts.php`.

Updated endpoints and usage:
- The router now handles `api/` paths and maps to `backend-php/api/*`.
- Authentication: `POST /api/auth/login` returns a JWT token; provide `Authorization: Bearer <token>` for protected endpoints.
- Typical endpoints: `GET /api/contacts`, `POST /api/contacts`, `GET /api/buses`, `POST /api/buses`, `GET /api/payments`, `POST /api/payments`, `GET /api/inspections`, `POST /api/inspections`.

Notes:
- Make sure `public/uploads` is writable by the webserver for uploads.
- Set `JWT_SECRET` in environment variables for token signing.
- This is a scaffold to accelerate migration; you should expand these endpoints to match your full application semantics, add input validation and rate-limiting, and sanitize/normalize data.

Usage:
1. Copy contents to the server's `public_html` or a folder within your FTP document root.
2. Configure environment variables on the server (or create a `.env`-loader) exposing `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, and `DB_PORT`.
3. Import the MySQL dump (`annts.sql`) into your MySQL server as shown in the main repo docs.

Expanding the backend:
- Add more endpoints (e.g., `inspections.php`, `payments.php`) mirroring your existing Prisma API endpoints.
- Add middleware to handle authentication (JWT/session) as needed.

Security note:
- Keep DB credentials and secrets out of the repo; use environment variables or the hosting control panel's secure settings.
- Use HTTPS and FTPS to avoid exposing credentials during deployment.
