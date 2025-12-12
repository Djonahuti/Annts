-- Create inspection table if it doesn't exist
-- Run this directly in your PostgreSQL database

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

-- Verify the table was created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'inspection';

