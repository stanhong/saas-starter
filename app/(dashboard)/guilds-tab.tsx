import { db } from '@/lib/db/drizzle';
import { guilds } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function GuildsTab() {
  const allGuilds = await db
    .select()
    .from(guilds)
    .orderBy(asc(guilds.rank));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg lg:text-xl font-medium text-muted-foreground mb-2">
          길드 랭킹
        </h2>
        <p className="text-sm text-muted-foreground">
          총 {allGuilds.length}개의 길드
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>길드 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-center">순위</TableHead>
                  <TableHead className="min-w-[120px]">길드명</TableHead>
                  <TableHead className="min-w-[100px]">길드장</TableHead>
                  <TableHead>설명</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allGuilds.map((guild) => (
                  <TableRow key={guild.id}>
                    <TableCell className="text-center font-medium">
                      {guild.rank}
                    </TableCell>
                    <TableCell className="font-medium">{guild.name}</TableCell>
                    <TableCell>{guild.leader}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {guild.description || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

