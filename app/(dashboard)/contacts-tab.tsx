'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Save, X, Plus } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Contact = {
  id: number;
  rank: number;
  nickname: string;
  guild: string;
  status: 'not_started' | 'in_progress' | 'completed';
  needsFollowUp: boolean;
  manager: string | null;
  memo: string | null;
  guildRank: number | null;
};

function formatGuildDisplay(guild: string, guildRank: number | null): string {
  if (guildRank !== null) {
    return `${guild}(${guildRank}위)`;
  }
  return `${guild}(25+ 위)`;
}

const statusConfig = {
  not_started: {
    label: '미진행',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    dot: 'bg-gray-400',
  },
  in_progress: {
    label: '진행 중',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    dot: 'bg-blue-500',
  },
  completed: {
    label: '완료',
    color: 'bg-green-100 text-green-700 border-green-300',
    dot: 'bg-green-500',
  },
};

function StatusBadge({ status, className }: { status: Contact['status']; className?: string }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border cursor-pointer ${config.color} ${className || ''}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
}

function FollowUpBadge({ 
  needsFollowUp, 
  status, 
  className 
}: { 
  needsFollowUp: boolean; 
  status: Contact['status'];
  className?: string;
}) {
  const getConfig = () => {
    // 상태가 미진행이면 항상 '-'
    if (status === 'not_started') {
      return {
        label: '-',
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        dot: 'bg-gray-400',
      };
    }
    
    // 진행 중 또는 완료 상태일 때
    if (needsFollowUp) {
      return {
        label: 'O',
        color: 'bg-green-100 text-green-700 border-green-300',
        dot: 'bg-green-500',
      };
    } else {
      return {
        label: 'X',
        color: 'bg-red-100 text-red-700 border-red-300',
        dot: 'bg-red-500',
      };
    }
  };
  
  const config = getConfig();
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.color} ${className || ''}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
}

function ManagerBadge({ manager, className }: { manager: string | null; className?: string }) {
  const getConfig = (manager: string | null) => {
    if (!manager) {
      return {
        label: '-',
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        dot: 'bg-gray-400',
      };
    }
    
    if (manager === '도둔') {
      return {
        label: manager,
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        dot: 'bg-orange-500',
      };
    }
    
    // 캄튼 또는 기타
    return {
      label: manager,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      dot: 'bg-blue-500',
    };
  };
  
  const config = getConfig(manager);
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.color} ${className || ''}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
}

export default function ContactsTab() {
  const { data: contactsData, mutate } = useSWR<Contact[]>(
    '/api/contacts',
    fetcher
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Contact>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    rank: 0,
    nickname: '',
    guild: '',
    status: 'not_started',
    needsFollowUp: false,
    manager: null,
    memo: null,
  });

  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setEditData(contact);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    setIsAdding(false);
    setNewContact({
      rank: 0,
      nickname: '',
      guild: '',
      status: 'not_started',
      needsFollowUp: false,
      manager: null,
      memo: null,
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditData({});
  };

  const handleAddSave = async () => {
    try {
      if (!newContact.rank || !newContact.nickname || !newContact.guild) {
        alert('수로, 닉네임, 길드는 필수 입력 항목입니다.');
        return;
      }

      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rank: newContact.rank,
          nickname: newContact.nickname,
          guild: newContact.guild,
          status: newContact.status || 'not_started',
          needsFollowUp: newContact.needsFollowUp || false,
          manager: newContact.manager || null,
          memo: newContact.memo || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create: ${response.status}`);
      }

      mutate();
      setIsAdding(false);
      setNewContact({
        rank: 0,
        nickname: '',
        guild: '',
        status: 'not_started',
        needsFollowUp: false,
        manager: null,
        memo: null,
      });
    } catch (error) {
      console.error('Error creating contact:', error);
      const errorMessage =
        error instanceof Error ? error.message : '추가 실패';
      alert(errorMessage);
    }
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update: ${response.status}`);
      }

      mutate();
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating contact:', error);
      const errorMessage =
        error instanceof Error ? error.message : '업데이트 실패';
      alert(errorMessage);
    }
  };

  const handleChange = (field: keyof Contact, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  if (!contactsData) {
    return <div>로딩 중...</div>;
  }

  // 정렬: 상태별로 진행 중 -> 완료 -> 미진행 순, 그 안에서는 순위 오름차순
  const sortedContacts = [...contactsData].sort((a, b) => {
    const statusOrder = {
      in_progress: 0,
      completed: 1,
      not_started: 2,
    };
    
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) {
      return statusDiff;
    }
    
    // 같은 상태 내에서는 순위 오름차순 (작은 수 -> 큰 수)
    return a.rank - b.rank;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg lg:text-xl font-medium text-muted-foreground mb-2">
          컨택 관리
        </h2>
        <p className="text-sm text-muted-foreground">
          총 {sortedContacts.length}개의 컨택
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>컨택 목록</CardTitle>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-center">수로 순위</TableHead>
                  <TableHead className="w-24">닉네임</TableHead>
                  <TableHead className="w-28">길드</TableHead>
                  <TableHead className="w-32 text-center">상태</TableHead>
                  <TableHead className="w-24 text-center">추후관리</TableHead>
                  <TableHead className="w-24">담당자</TableHead>
                  <TableHead className="min-w-[400px]">메모</TableHead>
                  <TableHead className="w-24 text-center">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isAdding && (
                  <TableRow>
                    <TableCell>
                      <Input
                        type="number"
                        value={newContact.rank || ''}
                        onChange={(e) =>
                          setNewContact((prev) => ({
                            ...prev,
                            rank: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-20"
                        placeholder="수로"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={newContact.nickname || ''}
                        onChange={(e) =>
                          setNewContact((prev) => ({
                            ...prev,
                            nickname: e.target.value,
                          }))
                        }
                        className="w-24"
                        placeholder="닉네임"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={newContact.guild || ''}
                        onChange={(e) =>
                          setNewContact((prev) => ({
                            ...prev,
                            guild: e.target.value,
                          }))
                        }
                        className="w-28"
                        placeholder="길드"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={(newContact.status || 'not_started') as string}
                        onValueChange={(value) =>
                          setNewContact((prev) => ({
                            ...prev,
                            status: value as 'not_started' | 'in_progress' | 'completed',
                          }))
                        }
                      >
                        <SelectTrigger className="w-auto h-auto py-1 px-2 border-0 bg-transparent shadow-none hover:bg-transparent p-0">
                          <StatusBadge
                            status={(newContact.status || 'not_started') as Contact['status']}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                              <span>미진행</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="in_progress">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              <span>진행 중</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="completed">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span>완료</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={
                          (() => {
                            const currentStatus = (newContact.status || 'not_started') as Contact['status'];
                            if (currentStatus === 'not_started') return '-';
                            return newContact.needsFollowUp ? 'O' : 'X';
                          })()
                        }
                        onValueChange={(value) => {
                          const currentStatus = (newContact.status || 'not_started') as Contact['status'];
                          if (currentStatus === 'not_started') {
                            return;
                          }
                          setNewContact((prev) => ({
                            ...prev,
                            needsFollowUp: value === 'O',
                          }));
                        }}
                        disabled={(newContact.status || 'not_started') === 'not_started'}
                      >
                        <SelectTrigger className="w-auto h-auto py-1 px-2 border-0 bg-transparent shadow-none hover:bg-transparent p-0">
                          <FollowUpBadge
                            needsFollowUp={newContact.needsFollowUp || false}
                            status={(newContact.status || 'not_started') as Contact['status']}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="O">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span>O</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="X">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              <span>X</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={newContact.manager || 'none'}
                        onValueChange={(value) =>
                          setNewContact((prev) => ({
                            ...prev,
                            manager: value === 'none' ? null : value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-auto h-auto py-1 px-2 border-0 bg-transparent shadow-none hover:bg-transparent p-0">
                          <ManagerBadge manager={newContact.manager || null} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="캄튼">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              <span>캄튼</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="도둔">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                              <span>도둔</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="none">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                              <span>-</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={newContact.memo || ''}
                        onChange={(e) =>
                          setNewContact((prev) => ({
                            ...prev,
                            memo: e.target.value,
                          }))
                        }
                        className="min-w-[400px]"
                        placeholder="메모"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {sortedContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    {editingId === contact.id ? (
                      <>
                        <TableCell>
                          <Input
                            type="number"
                            value={editData.rank ?? contact.rank}
                            onChange={(e) =>
                              handleChange('rank', parseInt(e.target.value))
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editData.nickname ?? contact.nickname}
                            onChange={(e) =>
                              handleChange('nickname', e.target.value)
                            }
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editData.guild ?? contact.guild}
                            onChange={(e) =>
                              handleChange('guild', e.target.value)
                            }
                            className="w-28"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={
                              (editData.status ?? contact.status) as string
                            }
                            onValueChange={(value) =>
                              handleChange(
                                'status',
                                value as 'not_started' | 'in_progress' | 'completed'
                              )
                            }
                          >
                            <SelectTrigger className="w-auto h-auto py-1 px-2 border-0 bg-transparent shadow-none hover:bg-transparent p-0">
                              <StatusBadge
                                status={
                                  (editData.status ?? contact.status) as Contact['status']
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not_started">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                  <span>미진행</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="in_progress">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                  <span>진행 중</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="completed">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  <span>완료</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={
                              (() => {
                                const currentStatus = (editData.status ?? contact.status) as Contact['status'];
                                if (currentStatus === 'not_started') return '-';
                                const currentFollowUp = editData.needsFollowUp !== undefined
                                  ? editData.needsFollowUp
                                  : contact.needsFollowUp;
                                return currentFollowUp ? 'O' : 'X';
                              })()
                            }
                            onValueChange={(value) => {
                              const currentStatus = (editData.status ?? contact.status) as Contact['status'];
                              if (currentStatus === 'not_started') {
                                // 미진행일 때는 변경 불가
                                return;
                              }
                              handleChange('needsFollowUp', value === 'O');
                            }}
                            disabled={(editData.status ?? contact.status) === 'not_started'}
                          >
                            <SelectTrigger className="w-auto h-auto py-1 px-2 border-0 bg-transparent shadow-none hover:bg-transparent p-0">
                              <FollowUpBadge
                                needsFollowUp={
                                  editData.needsFollowUp !== undefined
                                    ? editData.needsFollowUp
                                    : contact.needsFollowUp
                                }
                                status={
                                  (editData.status ?? contact.status) as Contact['status']
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="O">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  <span>O</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="X">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                  <span>X</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={editData.manager ?? contact.manager ?? 'none'}
                            onValueChange={(value) =>
                              handleChange('manager', value === 'none' ? null : value)
                            }
                          >
                            <SelectTrigger className="w-auto h-auto py-1 px-2 border-0 bg-transparent shadow-none hover:bg-transparent p-0">
                              <ManagerBadge
                                manager={editData.manager ?? contact.manager ?? null}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="캄튼">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                  <span>캄튼</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="도둔">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                  <span>도둔</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="none">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                  <span>-</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={editData.memo ?? contact.memo ?? ''}
                            onChange={(e) =>
                              handleChange('memo', e.target.value)
                            }
                            className="min-w-[400px]"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSave(contact.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-center font-medium">
                          {contact.rank}
                        </TableCell>
                        <TableCell className="font-medium">
                          {contact.nickname}
                        </TableCell>
                        <TableCell>
                          {formatGuildDisplay(contact.guild, contact.guildRank)}
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={contact.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <FollowUpBadge 
                            needsFollowUp={contact.needsFollowUp} 
                            status={contact.status}
                          />
                        </TableCell>
                        <TableCell>
                          <ManagerBadge manager={contact.manager} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {contact.memo || '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(contact)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </>
                    )}
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

