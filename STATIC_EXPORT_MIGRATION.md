# Static Export Migration Guide

Your Next.js app has been configured for static export. This means:

1. ✅ **Next.js API routes are removed** - All `/api/*` calls now go directly to PHP backend
2. ✅ **Server-side rendering removed** - Everything is client-side
3. ✅ **Static HTML/CSS/JS output** - Can be hosted on any static hosting

## What Changed

### Configuration
- `next.config.ts` - Added `output: 'export'` and `images: { unoptimized: true }`
- `package.json` - Added `export` script

### Code Changes
- `src/lib/api.ts` - Now intercepts `/api/*` calls and redirects to PHP backend
- `src/lib/php-api.ts` - Updated to work client-side
- `src/app/layout.tsx` - Converted to client-side (favicon loading moved to component)
- `src/contexts/AuthContext.tsx` - Updated to call PHP backend directly

### Files That Still Need Updates

Some files still call `fetch('/api/...')` directly. These will automatically work because of the global fetch wrapper in `src/lib/api.ts`, but for better performance and clarity, you can update them to use `callPHPBackend` directly:

**Files to optionally update:**
- `src/app/(auth)/signup/page.tsx`
- `src/app/(admin)/admin/users/page.tsx`
- `src/app/(admin)/admin/settings/page.tsx`
- `src/app/(admin)/admin/settings/edit/[settingId]/page.tsx`
- `src/app/(admin)/admin/payments/page.tsx`
- `src/app/(admin)/admin/pages/page.tsx`
- `src/app/(admin)/admin/pages/new/page.tsx`
- `src/app/(admin)/admin/pages/edit/[pageId]/page.tsx`
- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin)/admin/buses/page.tsx`
- `src/app/(admin)/admin/drivers/page.tsx`
- `src/app/(admin)/admin/add-bus/page.tsx`
- `src/app/(root)/services/page.tsx`
- `src/app/(root)/about/page.tsx`
- `src/app/(root)/page.tsx`
- `src/app/(root)/payment/[busId]/page.tsx`
- `src/components/Shared/Admin/sidebar.tsx`

**Note:** These will work as-is because of the global fetch wrapper, but updating them will be cleaner.

## Building for Production

```bash
npm run build
```

This will create an `out/` directory with static files ready to deploy.

## Deployment

The GitHub Actions workflow has been updated to:
1. Build static export
2. Deploy `out/` folder contents
3. Deploy PHP backend to `backend-php/` directory

## Environment Variables

Set `NEXT_PUBLIC_PHP_API_URL` in GitHub Secrets (already configured in workflow):
- Value should be: `https://annhurst-ts.cloud` (or your domain)

This will be embedded at build time into your static files.

## PHP Backend Setup

1. Create `.env` file in `backend-php/` on your server (not in git)
2. Add your database credentials and JWT_SECRET
3. Ensure PHP backend is accessible at the URL specified in `NEXT_PUBLIC_PHP_API_URL`

## Testing Locally

1. Start PHP backend (if you have PHP locally)
2. Build: `npm run build`
3. Serve static files: `npx serve out` or use any static file server
4. The app will call PHP backend at the URL specified in `NEXT_PUBLIC_PHP_API_URL`

## Important Notes

- **No NextAuth server-side** - Authentication is now fully client-side using JWT tokens
- **No API routes** - All API calls go directly to PHP backend
- **No server-side rendering** - All pages are static HTML with client-side React
- **Images are unoptimized** - For static export compatibility

