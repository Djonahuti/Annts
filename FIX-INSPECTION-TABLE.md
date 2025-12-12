# Fix Inspection Table - Complete Guide

## Problem
The inspection table wasn't created in the database, and the Prisma schema had a mismatch with the SQL schema (coordinator was BigInt instead of String).

## Solution Applied

### 1. Fixed Prisma Schema
- Changed `coordinator` from `BigInt?` (with foreign key) to `String?` (text, matching the SQL schema)
- Removed `coordinator_rel` relation from inspection model
- Removed `inspections` relation from coordinators model

### 2. Updated API Route
- Changed to store `coordinator.name` (string) instead of `coordinator.id` (BigInt)
- Removed `coordinator_rel` from the include statement in GET requests

### 3. Updated Admin Page
- Updated to use `coordinator` (string) directly instead of `coordinator_rel`
- Fixed filtering logic to work with coordinator names

## Steps to Deploy

### On Your Local Machine:

```bash
# 1. Regenerate Prisma Client with the updated schema
npx prisma generate

# 2. Push the schema to your local database
npx prisma db push

# 3. Verify the table was created
npx prisma studio
# You should now see the "inspection" table

# 4. Commit and push your changes
git add .
git commit -m "Fix inspection table schema: coordinator as string"
git push origin main  # or your branch
```

### On Your Production Server:

SSH into your server and run:

```bash
# 1. Navigate to project directory
cd ~/apps/Annhurst-ts

# 2. Pull latest code
git pull origin main  # or your branch

# 3. Install dependencies (if needed)
npm install

# 4. Push schema to production database
npx prisma db push

# 5. Regenerate Prisma Client
npx prisma generate

# 6. Restart the application
pm2 restart nextjs

# 7. Check logs to verify
pm2 logs nextjs --lines 30
```

## Verification

After completing the steps:

1. **Local:** Open Prisma Studio and verify the `inspection` table exists
2. **Production:** Check PM2 logs - you should no longer see "Response from the Engine was empty" errors
3. **Test:** Try submitting an inspection form - it should work now

## If `prisma db push` Fails

If you get errors, you can create the table manually using SQL:

```sql
CREATE TABLE IF NOT EXISTS public.inspection (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  month date,
  coordinator text,
  bus bigint,
  pdf text,
  video text,
  code text,
  d_uploaded date,
  video_gp text,
  plate_number text,
  bus_uploaded text,
  issue text,
  both_vid_pdf text,
  inspection_completed_by text,
  issues text,
  CONSTRAINT inspection_pkey PRIMARY KEY (id),
  CONSTRAINT inspection_bus_fkey FOREIGN KEY (bus) REFERENCES public.buses(id)
);
```

Then run:
```bash
npx prisma generate
pm2 restart nextjs
```

