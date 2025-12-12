# Deployment Guide

This guide explains how to deploy your Next.js + PHP backend application to your online server.

## Prerequisites

1. **GitHub Secrets Setup**: Add these secrets to your GitHub repository:
   - `FTP_SERVER` - Your FTP server address
   - `FTP_USERNAME` - Your FTP username
   - `FTP_PASSWORD` - Your FTP password
   - `FTP_PORT` - FTP port (usually 21)
   - `PHP_API_URL` - Your PHP backend URL (e.g., `https://yourdomain.com/backend-php`)

## Environment Variables

### For Next.js (GitHub Actions)

Add `PHP_API_URL` to your GitHub Secrets. This will be used during the build process to embed the PHP backend URL into your Next.js app.

**Important**: Use `NEXT_PUBLIC_PHP_API_URL` format in the workflow (it's automatically prefixed). The value should be your full domain URL where PHP backend is accessible, e.g.:
- `https://yourdomain.com/backend-php` or
- `https://yourdomain.com` (if PHP backend is in root)

### For PHP Backend (On Server)

You need to create a `.env` file **manually on your server** in the `backend-php/` directory. The `.env.example` file will be deployed as a reference, but you must create the actual `.env` file with your real credentials.

**Steps to create PHP .env file on server:**

1. SSH/FTP into your server
2. Navigate to `backend-php/` directory
3. Create a file named `.env` (not `.env.example`)
4. Add the following content (replace with your actual values):

```env
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
```

**Important Notes:**
- `.env.example` is just a template - it won't work automatically
- The actual `.env` file should **NOT** be committed to git (it's in .gitignore)
- You must create `.env` manually on the server after first deployment

## Deployment Process

1. **Push to main branch**: The GitHub Action will automatically:
   - Build your Next.js app with the PHP API URL embedded
   - Deploy files via FTP to your server

2. **On your server** (first time only):
   - Create the `.env` file in `backend-php/` directory with your database credentials
   - Ensure PHP has read permissions for the `.env` file
   - Make sure `public/uploads` directory exists and is writable (for file uploads)

## Server Requirements

### For Next.js:
- **Static hosting only** (configured for static export)
  - Any web server that can serve static files (Apache, Nginx, etc.)
  - No Node.js required!
  - Just upload the `out/` folder contents to your web root

### For PHP Backend:
- PHP 7.4+ installed
- MySQL/MariaDB database
- Apache/Nginx with PHP support
- Write permissions for `public/uploads` directory

## File Structure on Server

After deployment, your server should have:

```
/
├── index.html         # Next.js static export (root page)
├── _next/             # Next.js static assets
├── [other static files from out/]
├── backend-php/       # PHP backend
│   ├── api/           # API endpoints
│   ├── db.php         # Database connection
│   ├── index.php      # Router
│   ├── .env           # ⚠️ CREATE THIS MANUALLY
│   └── .env.example   # Template (deployed automatically)
└── uploads/           # File uploads directory (should exist)
```

## Troubleshooting

### PHP Backend Not Working
- Check that `.env` file exists in `backend-php/` directory
- Verify database credentials in `.env`
- Check PHP error logs
- Ensure `backend-php/` is accessible via web server

### Next.js Can't Connect to PHP Backend
- Verify `PHP_API_URL` secret in GitHub matches your actual domain
- Check that PHP backend is accessible at the URL specified
- Review browser console for CORS errors
- Ensure PHP backend returns proper CORS headers if needed
- Check browser Network tab to see if requests are going to the correct PHP backend URL
- Verify `NEXT_PUBLIC_PHP_API_URL` was set during build (check built JavaScript files)

### Environment Variables Not Working
- For Next.js: Variables must be set during build (via GitHub Secrets)
- For PHP: `.env` file must exist on server (not in git)
- Restart Node.js server after changing environment variables

## Security Notes

- Never commit `.env` files to git
- Use strong `JWT_SECRET` in PHP `.env`
- Keep database credentials secure
- Use HTTPS in production
- Regularly update dependencies

