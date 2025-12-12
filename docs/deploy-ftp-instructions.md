# GitHub Actions FTP deployment instructions

1. Add Secrets
   - In GitHub: Settings → Secrets → Actions: add `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, and `FTP_PORT` (21 for explicit FTPS).

2. Configure the workflow
   - The workflow file is `.github/workflows/deploy-ftp.yml`. It builds the Next.js project and copies `out/` or `public/` to a `deploy/` folder, then copies the `backend-php` folder.
   - Adjust `server-dir` if you want to change where files get uploaded (for example, `/public_html` or `/` depending on hosting).

3. Prepare your server
   - Ensure your FTP user has permission to write to the destination directory.
   - Use FTPS if your host supports it; the workflow uses `ftps` protocol.

4. Run deployment
   - Push changes to the `main` branch to trigger the workflow.
   - Check the Actions tab for logs and FTP upload details.
