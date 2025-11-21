import { db } from '@/lib/db/drizzle';
import { guilds } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const allGuilds = await db
      .select()
      .from(guilds)
      .orderBy(asc(guilds.rank));

    return NextResponse.json(allGuilds);
  } catch (error) {
    console.error('Error fetching guilds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guilds' },
      { status: 500 }
    );
  }
}

