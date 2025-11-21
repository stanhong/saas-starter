-- Add status column
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "status" varchar(20) DEFAULT 'not_started' NOT NULL;

-- Migrate existing data from is_contacted to status
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'is_contacted') THEN
    UPDATE "contacts" 
    SET "status" = CASE 
      WHEN "is_contacted" = true THEN 'completed'
      ELSE 'not_started'
    END;
    
    ALTER TABLE "contacts" DROP COLUMN "is_contacted";
  END IF;
END $$;

