ALTER TABLE "Reservation"
  ADD COLUMN "pickup_location" TEXT,
  ADD COLUMN "dropoff_location" TEXT,
  ADD COLUMN "child_seat" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "video_recorder" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Reservation"
  ALTER COLUMN "customer_email" DROP NOT NULL;
