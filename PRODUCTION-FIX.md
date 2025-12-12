# Fix Inspection Table on Production Server

## Error
```
The table `public.inspection` does not exist in the current database.
```

## Solution

The table wasn't created. You have two options:

### Option 1: Using Prisma (Recommended)

SSH into your server and run:

```bash
cd ~/apps/Annhurst-ts

# Make sure you have the latest code
git pull origin main  # or your branch

# Push the schema to create the table
npx prisma db push --accept-data-loss

# Regenerate Prisma Client
npx prisma generate

# Restart the app
pm2 restart nextjs

# Check logs
pm2 logs nextjs --lines 20
```

### Option 2: Using SQL Directly (If Prisma fails)

**Step 1:** Connect to your database using `psql`:

```bash
cd ~/apps/Annhurst-ts

# Get your DATABASE_URL from .env
cat .env | grep DATABASE_URL

# Connect to database (replace with your actual connection string)
psql "your-database-url-here"
```

**Step 2:** Run this SQL:

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

**Step 3:** Exit psql and regenerate Prisma Client:

```bash
# Exit psql
\q

# Regenerate Prisma Client
npx prisma generate

# Restart the app
pm2 restart nextjs

# Check logs
pm2 logs nextjs --lines 20
```

### Option 3: Using the Script

I've created a script for you. On your server:

```bash
cd ~/apps/Annhurst-ts

# Make the script executable
chmod +x create-table-production.sh

# Run it
./create-table-production.sh
```

## Verify Table Exists

After creating the table, verify it:

```bash
# Using Prisma Studio (if you have access)
npx prisma studio

# Or using psql
psql "$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")" -c "\d inspection"
```

You should see the table structure.

## Troubleshooting

### If you get "permission denied":
- Make sure you're using the correct database user
- Check that the user has CREATE TABLE permissions

### If you get "relation buses does not exist":
- The buses table must exist first
- Check: `psql "your-db-url" -c "\d buses"`

### If Prisma still can't find the table:
- Make sure you're connected to the correct database
- Check your `DATABASE_URL` in `.env`
- Try: `npx prisma db pull` to sync Prisma with the actual database

