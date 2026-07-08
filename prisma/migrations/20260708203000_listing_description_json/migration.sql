-- AlterTable
ALTER TABLE "Listing"
ALTER COLUMN "description" TYPE JSONB
USING CASE
  WHEN "description" IS NULL THEN NULL
  ELSE jsonb_build_array(
    jsonb_build_object(
      'type', 'p',
      'children', jsonb_build_array(jsonb_build_object('text', "description"))
    )
  )
END;
