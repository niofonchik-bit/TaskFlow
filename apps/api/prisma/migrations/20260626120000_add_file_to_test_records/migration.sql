ALTER TABLE "test_records"
ADD COLUMN "file_name" TEXT,
ADD COLUMN "file_key" TEXT,
ADD COLUMN "file_mime_type" TEXT,
ADD COLUMN "file_size" INTEGER,
ADD COLUMN "file_updated_at" TIMESTAMP(3);

CREATE UNIQUE INDEX "test_records_file_key_key"
ON "test_records"("file_key");