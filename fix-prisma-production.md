# Fix Prisma Client on Production Server

## Issue
The error "Response from the Engine was empty" means Prisma Client needs to be regenerated on your production server.

## Solution

SSH into your production server and run these commands:

### Step 1: Navigate to your project directory
```bash
cd /path/to/your/project  # Usually something like /var/www/annhurst-ts.com or /home/david/annhurst-ts
```

### Step 2: Regenerate Prisma Client
```bash
npx prisma generate
```

### Step 3: Restart your Next.js application

If using PM2:
```bash
pm2 restart nextjs
# or
pm2 restart all
```

If using systemd:
```bash
sudo systemctl restart nextjs
```

### Step 4: Verify

Check the logs to make sure it's working:
```bash
pm2 logs nextjs --lines 50
```

You should no longer see "Response from the Engine was empty" errors.

## Alternative: Full Rebuild

If the above doesn't work, you may need to rebuild:

```bash
# Stop the app
pm2 stop nextjs

# Regenerate Prisma Client
npx prisma generate

# Rebuild Next.js (if needed)
npm run build

# Start the app
pm2 start nextjs
```

## Note

After deploying new Prisma schema changes, always run `npx prisma generate` on the production server before restarting the application.

