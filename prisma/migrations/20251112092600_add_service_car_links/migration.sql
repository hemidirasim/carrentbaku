CREATE TABLE "public"."ServiceCar" (
  "service_id" TEXT NOT NULL,
  "car_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ServiceCar_pkey" PRIMARY KEY ("service_id", "car_id"),
  CONSTRAINT "ServiceCar_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ServiceCar_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "public"."Car"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ServiceCar_car_id_idx" ON "public"."ServiceCar" ("car_id");
