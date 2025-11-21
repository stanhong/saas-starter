-- Safely migrate is_contacted to status if is_contacted exists
-- Note: status column already exists from migration 0002, so we just migrate data and drop is_contacted
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'is_contacted') THEN
    -- Migrate existing data from is_contacted to status
    UPDATE "contacts" 
    SET "status" = CASE 
      WHEN "is_contacted" = true THEN 'completed'
      ELSE 'not_started'
    END
    WHERE "status" = 'not_started';
    
    -- Drop the old column
    ALTER TABLE "contacts" DROP COLUMN "is_contacted";
  END IF;
END $$;