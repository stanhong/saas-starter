import { db } from '@/lib/db/drizzle';
import { contacts, guilds } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allContacts = await db
      .select()
      .from(contacts)
      .orderBy(asc(contacts.rank));

    const allGuilds = await db.select().from(guilds);

    // 길드명으로 매칭하여 랭킹 정보 추가
    const contactsWithGuildRank = allContacts.map((contact) => {
      const matchedGuild = allGuilds.find(
        (guild) => guild.name === contact.guild
      );
      return {
        ...contact,
        guildRank: matchedGuild ? matchedGuild.rank : null,
      };
    });

    return NextResponse.json(contactsWithGuildRank);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rank, nickname, guild, status, needsFollowUp, manager, memo } =
      body;

    const [newContact] = await db
      .insert(contacts)
      .values({
        rank,
        nickname,
        guild,
        status: status ?? 'not_started',
        needsFollowUp: needsFollowUp ?? false,
        manager: manager || null,
        memo: memo || null,
      })
      .returning();

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

