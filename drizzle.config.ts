import type { Config } from 'drizzle-kit';

// 마이그레이션용으로는 non-pooling URL 사용 (Supabase 권장)
const postgresUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!postgresUrl) {
  throw new Error('POSTGRES_URL or POSTGRES_URL_NON_POOLING environment variable is not set');
}

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: postgresUrl,
  },
} satisfies Config;
