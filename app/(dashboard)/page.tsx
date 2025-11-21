import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GuildsTab from './guilds-tab';
import ContactsTab from './contacts-tab';

export default function HomePage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          삼전 길드 내부용
        </h1>
      </div>

      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="h-16 w-full max-w-lg mb-8 bg-gray-100 p-1.5">
          <TabsTrigger
            value="contacts"
            className="text-xl font-bold px-10 py-4 data-[state=active]:bg-white data-[state=active]:text-orange-500 data-[state=active]:shadow-lg"
          >
            컨택
          </TabsTrigger>
          <TabsTrigger
            value="guilds"
            className="text-xl font-bold px-10 py-4 data-[state=active]:bg-white data-[state=active]:text-orange-500 data-[state=active]:shadow-lg"
          >
            길드
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contacts">
          <ContactsTab />
        </TabsContent>
        <TabsContent value="guilds">
          <GuildsTab />
        </TabsContent>
      </Tabs>
    </section>
  );
}
