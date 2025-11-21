import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// POSTGRES_URL이 없으면 POSTGRES_URL_NON_POOLING 사용 (Supabase 호환)
const postgresUrl = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;

if (!postgresUrl) {
  throw new Error('POSTGRES_URL or POSTGRES_URL_NON_POOLING environment variable is not set');
}

export const client = postgres(postgresUrl);
export const db = drizzle(client, { schema });
