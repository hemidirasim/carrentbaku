-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" TEXT NOT NULL,
    "company_name" TEXT,
    "tagline" TEXT,
    "description" TEXT,
    "phones" TEXT,
    "emails" TEXT,
    "whatsapp_numbers" TEXT,
    "office_hours" TEXT,
    "address" TEXT,
    "address_secondary" TEXT,
    "map_embed_url" TEXT,
    "social_links" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

