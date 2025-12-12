#!/bin/bash

# Script to create inspection table on production server
# Run this on your production server

echo "Creating inspection table..."

# Get database URL from .env file
if [ -f .env ]; then
    DATABASE_URL=$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    echo "Found DATABASE_URL in .env"
else
    echo "Error: .env file not found"
    exit 1
fi

# Strip Prisma schema query parameter (psql doesn't support ?schema=public)
CLEAN_DATABASE_URL=${DATABASE_URL%\?schema=public}

# Create table using psql
psql "$CLEAN_DATABASE_URL" <<EOF
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
EOF

if [ $? -eq 0 ]; then
    echo "✅ Table created successfully!"
    echo "Regenerating Prisma Client..."
    npx prisma generate
    echo "Restarting PM2..."
    pm2 restart nextjs
    echo "✅ Done! Check logs: pm2 logs nextjs --lines 20"
else
    echo "❌ Error creating table. Check your DATABASE_URL and permissions."
    exit 1
fi

