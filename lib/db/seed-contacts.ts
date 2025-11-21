import { db } from './drizzle';
import { contacts } from './schema';

const contactsData = [
  {
    rank: 77,
    nickname: '고연',
    guild: '루키',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  },
  {
    rank: 78,
    nickname: '지강세',
    guild: '원코어',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  },
  {
    rank: 83,
    nickname: '견인',
    guild: '깡냉이',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  },
  {
    rank: 88,
    nickname: '천지창조',
    guild: '댕대댕스',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  },
  {
    rank: 89,
    nickname: '쥬부',
    guild: '회개',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  },
  {
    rank: 91,
    nickname: '메르랑',
    guild: '-',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  },
  {
    rank: 106,
    nickname: '예민이',
    guild: '뾰로롱',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  },
  {
    rank: 119,
    nickname: '루잰',
    guild: '회개',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  },
  {
    rank: 120,
    nickname: '금봄',
    guild: '지킴',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  },
  {
    rank: 61,
    nickname: '빅빅',
    guild: '노답이',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  },
];

async function seedContacts() {
  console.log('Seeding contacts data...');

  // 기존 데이터 삭제 (선택사항)
  await db.delete(contacts);
  console.log('Cleared existing contacts data');

  // 데이터 삽입
  await db.insert(contacts).values(
    contactsData.map((contact) => ({
      rank: contact.rank,
      nickname: contact.nickname,
      guild: contact.guild,
      status: contact.status,
      needsFollowUp: contact.needsFollowUp,
      manager: contact.manager,
      memo: contact.memo,
    }))
  );

  console.log('✅ Contacts data seeded successfully!');
  console.log(`Inserted ${contactsData.length} contacts`);
}

seedContacts()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });

