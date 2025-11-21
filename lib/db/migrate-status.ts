import { client } from './drizzle';
import dotenv from 'dotenv';

dotenv.config();

async function migrateStatus() {
  console.log('Migrating is_contacted to status...');

  try {
    // Check if is_contacted column exists
    const checkColumn = await client`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contacts' AND column_name = 'is_contacted'
    `;

    if (checkColumn.length > 0) {
      console.log('Found is_contacted column, migrating...');

      // Add status column if it doesn't exist
      await client`
        ALTER TABLE contacts 
        ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'not_started' NOT NULL
      `;

      // Migrate data
      await client`
        UPDATE contacts 
        SET status = CASE 
          WHEN is_contacted = true THEN 'completed'
          ELSE 'not_started'
        END
      `;

      // Drop old column
      await client`
        ALTER TABLE contacts DROP COLUMN is_contacted
      `;

      console.log('✅ Migration completed successfully!');
    } else {
      console.log('is_contacted column not found, checking status column...');
      
      // Check if status column exists
      const checkStatus = await client`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'status'
      `;

      if (checkStatus.length === 0) {
        // Add status column
        await client`
          ALTER TABLE contacts 
          ADD COLUMN status varchar(20) DEFAULT 'not_started' NOT NULL
        `;
        console.log('✅ Added status column');
      } else {
        console.log('✅ Status column already exists');
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

migrateStatus()
  .then(() => {
    console.log('Migration finished. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });

