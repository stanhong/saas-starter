import { db } from './drizzle';
import { guilds } from './schema';

const guildData = `노답이/막더 (순위권100등 이하 가입문의.)
넘버원/신점 (1위 길드 목표 / 100위권 내 가입 문의주세요)
냐옹이/영웅덕선 (현 토벌 3위 랭커분 2분 모셔용 귓 남겨주세용)
아레나/일땡 
삼전/캄튼
쭈꾸미대마왕/사가라소스케 (출책만해도 같이 갑니다.) 
단련/대량 (1일이상 미접 추방 / 투력 5억이상 화녕 / 시끄러운 사람 화녕)
윙즈/Focus (1억 이상 길드원 모집중)
쁘띠/윤아진 (60이상 가입신청 받겠습니다) 
물음표/알잘딱 (65레벨 이상 고투력자환영 풀접 환영 토벌전 무료건설 필수)
백설공주/하얀난쟁이
멸공의횃불/애국보수우파 (애국보수 멸공 투력 1억 이상 가입)
즐겁게/우가가 (즐겁게해요.)
Slayer/이똘망 (전투력 3억이상 같이 함께 키워 나갈 분들 구합니다. 가입여부 이똘망 귓@@@@@)
앙증/강서동 (투력5천만이상 가입신청 넣어주세요!!)
화령/닌텐도스위치 (환영합니다)
뉴욕/팝핑 (Where Dreams Are Made Of !)
환영/syyr (느린동료는 두고감)
회개/가위비 (1억 이상 모집합니다.)
혈맹기사단/따흑이 (길드 가입시 경험치 쿠폰,레이드 등등 컨텐츠 많으니 같이 성장하실 용사님들 환영합니다!)
산책로/우유청 (등반가 길드 산책로입니다.)
에펨코리아/카토렐라 (매일 길드 숙제 챙겨주고 꾸준한 접속을 해주실분 얼마든지 가입해주세요 (전투력 3억 이상)
무궁/모르지미 
민트/선섹 (민트는 토끼에요)
나루/나루니 (가입조건 전투력 5000만 이상, 미접 3일 추방)`;

function parseGuildData(data: string): Array<{
  name: string;
  leader: string;
  description: string;
  rank: number;
}> {
  const lines = data.trim().split('\n');
  return lines.map((line, index) => {
    const rank = index + 1;
    const trimmedLine = line.trim();
    
    // 괄호 안의 설명 추출
    const descriptionMatch = trimmedLine.match(/\(([^)]+)\)/);
    const description = descriptionMatch ? descriptionMatch[1] : '';
    
    // 괄호 제거한 나머지 부분
    const mainPart = trimmedLine.replace(/\s*\([^)]+\)\s*$/, '').trim();
    
    // 길드명/길드장명 분리
    const parts = mainPart.split('/');
    if (parts.length !== 2) {
      throw new Error(`Invalid format at line ${rank}: ${line}`);
    }
    
    const name = parts[0].trim();
    const leader = parts[1].trim();
    
    return {
      name,
      leader,
      description,
      rank,
    };
  });
}

async function seedGuilds() {
  console.log('Parsing guild data...');
  const parsedGuilds = parseGuildData(guildData);
  
  console.log(`Found ${parsedGuilds.length} guilds to insert`);
  
  // 기존 데이터 삭제 (선택사항 - 주석 처리하면 추가만 됨)
  await db.delete(guilds);
  console.log('Cleared existing guild data');
  
  // 데이터 삽입
  await db.insert(guilds).values(
    parsedGuilds.map((guild) => ({
      name: guild.name,
      leader: guild.leader,
      description: guild.description || null,
      rank: guild.rank,
    }))
  );
  
  console.log('✅ Guild data seeded successfully!');
  console.log(`Inserted ${parsedGuilds.length} guilds`);
}

seedGuilds()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });

