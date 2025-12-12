# Create Inspection Table in Database

## Issue
The inspection table doesn't exist in your database, which is why Prisma Client can't find it.

## Solution

### On Your Local Machine (First)

1. **Verify the schema is correct:**
   ```bash
   cat prisma/schema.prisma | grep -A 20 "model inspection"
   ```

2. **Push the schema to your local database:**
   ```bash
   npx prisma db push
   ```

3. **Verify the table was created:**
   ```bash
   npx prisma studio
   ```
   You should see the "inspection" table in the list.

### On Your Production Server

SSH into your server and run:

```bash
# 1. Navigate to project directory
cd ~/apps/Annhurst-ts

# 2. Pull latest code (if using git)
git pull origin main  # or your branch name

# 3. Install dependencies (if schema changed)
npm install

# 4. Push schema to production database
npx prisma db push

# 5. Verify it worked (should see "Your database is now in sync")
# If you see errors, check them

# 6. Regenerate Prisma Client
npx prisma generate

# 7. Restart the application
pm2 restart nextjs

# 8. Check logs
pm2 logs nextjs --lines 30
```

## Alternative: Manual SQL Creation

If `prisma db push` doesn't work, you can create the table manually using SQL:

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

## Verify Table Exists

After creating, verify with:

```bash
# Using Prisma Studio
npx prisma studio

# Or using psql
psql $DATABASE_URL -c "\d inspection"
```

