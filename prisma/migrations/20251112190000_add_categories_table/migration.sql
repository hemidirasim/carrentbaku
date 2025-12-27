-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_az" TEXT NOT NULL,
    "name_ru" TEXT,
    "name_en" TEXT,
    "name_ar" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- Seed default categories
INSERT INTO "Category" ("id", "slug", "name_az", "name_en", "sort_order", "is_active", "created_at", "updated_at") VALUES ('1d01259a-80c7-47c5-8dd0-679f6739baa7', 'econom', 'Econom', 'Econom', 10, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "Category" ("id", "slug", "name_az", "name_en", "sort_order", "is_active", "created_at", "updated_at") VALUES ('81c7913d-2d2e-4453-a36e-3e35c0213e27', 'medium-sedan', 'Medium Sedan', 'Medium Sedan', 20, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "Category" ("id", "slug", "name_az", "name_en", "sort_order", "is_active", "created_at", "updated_at") VALUES ('b77b3642-5a08-433b-bbf2-27c3d0c2d5f1', 'suv', 'SUV', 'SUV', 30, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "Category" ("id", "slug", "name_az", "name_en", "sort_order", "is_active", "created_at", "updated_at") VALUES ('14abdae0-b760-4158-ba76-852474add5de', 'luxury', 'Luxury', 'Luxury', 40, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "Category" ("id", "slug", "name_az", "name_en", "sort_order", "is_active", "created_at", "updated_at") VALUES ('e21cb1c1-ca28-451f-a595-a037dd92bece', 'minivan', 'Minivan', 'Minivan', 50, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "Category" ("id", "slug", "name_az", "name_en", "sort_order", "is_active", "created_at", "updated_at") VALUES ('e3924470-6bfb-4ea6-a5dc-c1e8fe7a8658', 'big-bus', 'Big Bus', 'Big Bus', 60, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
