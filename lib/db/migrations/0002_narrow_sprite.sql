CREATE TABLE IF NOT EXISTS "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"rank" integer NOT NULL,
	"nickname" varchar(100) NOT NULL,
	"guild" varchar(100) NOT NULL,
	"status" varchar(20) DEFAULT 'not_started' NOT NULL,
	"needs_follow_up" boolean DEFAULT false NOT NULL,
	"manager" varchar(50),
	"memo" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Migrate existing data if is_contacted column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'is_contacted') THEN
    UPDATE "contacts" 
    SET "status" = CASE 
      WHEN "is_contacted" = true THEN 'completed'
      ELSE 'not_started'
    END
    WHERE "status" = 'not_started';
    
    ALTER TABLE "contacts" DROP COLUMN "is_contacted";
  END IF;
END $$;
