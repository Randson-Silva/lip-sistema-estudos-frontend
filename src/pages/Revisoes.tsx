import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MainLayout } from "@/components/layout/MainLayout";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, Loader2 } from "lucide-react";
import { useReviews } from "@/hooks/use-reviews";

export default function Revisoes() {
  const {
    overdueReviews,
    todayReviews,
    completedReviews,
    toggleReview,
    isLoading,
  } = useReviews();

  const today = new Date();

  if (isLoading) {
    return (
      <MainLayout title="Minhas Revisões">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Minhas Revisões">
      <div className="flex items-center gap-2 text-muted-foreground mb-6 -mt-2">
        <CalendarDays className="h-4 w-4" />
        <span className="text-sm font-medium capitalize">
          {format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </span>
      </div>

      <Tabs defaultValue="today" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger
            value="overdue"
            className="data-[state=active]:text-red-600"
          >
            Atrasadas ({overdueReviews.length})
          </TabsTrigger>
          <TabsTrigger value="today">Hoje ({todayReviews.length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-240px)] pr-4">
          <TabsContent value="overdue" className="space-y-4 mt-0">
            {overdueReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p>Nenhuma revisão atrasada! 🎉</p>
                <p className="text-xs">Você está com o conteúdo em dia.</p>
              </div>
            ) : (
              overdueReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  variant="overdue"
                  onToggle={() => toggleReview(review.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-4 mt-0">
            {todayReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p>Tudo pronto por hoje.</p>
                <p className="text-xs">
                  Aproveite para descansar ou adiantar estudos.
                </p>
              </div>
            ) : (
              todayReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  variant="today"
                  onToggle={() => toggleReview(review.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-0">
            {completedReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p>Nenhuma revisão concluída ainda.</p>
              </div>
            ) : (
              completedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  variant="completed"
                  onToggle={() => toggleReview(review.id)}
                />
              ))
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </MainLayout>
  );
}
