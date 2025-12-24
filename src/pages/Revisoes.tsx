import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { useStudy } from '@/contexts/StudyContext';

export default function Revisoes() {
  const { getOverdueReviews, getTodayReviews, getCompletedReviews, toggleReviewComplete } = useStudy();
  const [activeTab, setActiveTab] = useState('today');

  const overdueReviews = getOverdueReviews();
  const todayReviews = getTodayReviews();
  const completedReviews = getCompletedReviews();

  return (
    <MainLayout title="Minhas Revisões">
      <Card className="max-w-4xl animate-fade-in">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 mb-6">
              <TabsTrigger 
                value="overdue"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground"
              >
                Atrasadas ({overdueReviews.length})
              </TabsTrigger>
              <TabsTrigger 
                value="today"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground"
              >
                Para Hoje ({todayReviews.length})
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground"
              >
                Concluídas ({completedReviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overdue" className="mt-0 space-y-3">
              {overdueReviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhuma revisão atrasada!</p>
              ) : (
                overdueReviews.map(review => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    variant="overdue"
                    onToggle={() => toggleReviewComplete(review.id)}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="today" className="mt-0 space-y-3">
              {todayReviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhuma revisão para hoje!</p>
              ) : (
                todayReviews.map(review => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    variant="today"
                    onToggle={() => toggleReviewComplete(review.id)}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0 space-y-3">
              {completedReviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhuma revisão concluída ainda.</p>
              ) : (
                completedReviews.map(review => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    variant="completed"
                    onToggle={() => toggleReviewComplete(review.id)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
