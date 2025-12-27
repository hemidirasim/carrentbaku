-- Add categories array column to car and populate with existing category values
ALTER TABLE public.Car ADD COLUMN categories TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE public.Car
SET categories = CASE
  WHEN category IS NOT NULL AND length(trim(category)) > 0 THEN ARRAY[category]
  ELSE ARRAY[]::TEXT[]
END;
