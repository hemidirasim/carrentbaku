-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title_az" TEXT NOT NULL,
    "title_ru" TEXT,
    "title_en" TEXT,
    "title_ar" TEXT,
    "description_az" TEXT NOT NULL,
    "description_ru" TEXT,
    "description_en" TEXT,
    "description_ar" TEXT,
    "image_url" TEXT,
    "icon" TEXT,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title_az" TEXT NOT NULL,
    "title_ru" TEXT,
    "title_en" TEXT,
    "title_ar" TEXT,
    "slug" TEXT NOT NULL,
    "content_az" TEXT NOT NULL,
    "content_ru" TEXT,
    "content_en" TEXT,
    "content_ar" TEXT,
    "excerpt_az" TEXT,
    "excerpt_ru" TEXT,
    "excerpt_en" TEXT,
    "excerpt_ar" TEXT,
    "image_url" TEXT,
    "author" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_location" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "title_az" TEXT NOT NULL,
    "title_ru" TEXT,
    "title_en" TEXT,
    "title_ar" TEXT,
    "content_az" TEXT NOT NULL,
    "content_ru" TEXT,
    "content_en" TEXT,
    "content_ar" TEXT,
    "video_url" TEXT,
    "review_type" TEXT NOT NULL DEFAULT 'text',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "Service"("category");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_published_idx" ON "BlogPost"("published");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE INDEX "Review_featured_idx" ON "Review"("featured");

-- CreateIndex
CREATE INDEX "Review_review_type_idx" ON "Review"("review_type");

-- CreateIndex
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage"("status");

-- CreateIndex
CREATE INDEX "ContactMessage_created_at_idx" ON "ContactMessage"("created_at");
