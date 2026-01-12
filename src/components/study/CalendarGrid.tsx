import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StudyRecord } from "@/types/study";
import { Review } from "@/types/review";
import { StudyCard } from "./StudyCard";
import { ReviewCardMini } from "../reviews/ReviewCardMini";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { normalizeDate } from "@/lib/date-utils";

interface CalendarGridProps {
  studies: StudyRecord[];
  reviews: Review[];
  currentDate: Date;
  selectedDate: Date | null; // Adicionado
  onDateSelect: (date: Date) => void; // Adicionado
  onEditStudy: (study: StudyRecord) => void;
  onAddStudy: (date: Date) => void;
  onToggleReview: (id: string) => void;
}

export function CalendarGrid({
  studies,
  reviews,
  currentDate,
  selectedDate,
  onDateSelect,
  onEditStudy,
  onAddStudy,
  onToggleReview,
}: CalendarGridProps) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(startDate, i)
  );

  const getStudiesForDate = (date: Date) =>
    studies.filter((study) => isSameDay(normalizeDate(study.date), date));

  const getReviewsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return reviews.filter((r) => r.dueDate === dateStr);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0">
      <div className="hidden md:grid grid-cols-7 gap-4 mb-3 min-w-0">
        {weekDays.map((day) => (
          <div key={day.toString()} className="text-center space-y-2 min-w-0">
            <div className="text-sm font-medium capitalize text-muted-foreground truncate">
              {format(day, "EEE", { locale: ptBR })}
            </div>
            <div
              className={cn(
                "mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                isSameDay(day, new Date())
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/60"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 md:auto-rows-fr gap-4 flex-1 min-h-0 min-w-0">
        {weekDays.map((day) => {
          const dayStudies = getStudiesForDate(day);
          const dayReviews = getReviewsForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={cn(
                "flex flex-col rounded-lg border bg-card min-h-0 min-w-0 h-full overflow-hidden",
                "md:border-l md:border-t-0 md:border-r-0 md:border-b-0 md:border-border/40 md:bg-transparent"
              )}
            >
              <div className="md:hidden p-3 border-b flex justify-between items-center min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <span className="capitalize font-medium truncate">
                    {format(day, "EEEE", { locale: ptBR })}
                  </span>
                </div>

                {isToday && (
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full shrink-0">
                    Hoje
                  </span>
                )}
              </div>

              <ScrollArea className="flex-1 min-h-0 min-w-0 px-2">
                <div className="space-y-2 py-2 min-w-0">
                  {dayStudies.map((study) => (
                    <div
                      key={study.id}
                      className="min-w-0 max-w-full overflow-hidden"
                    >
                      <StudyCard
                        study={study}
                        onClick={() => onEditStudy(study)}
                      />
                    </div>
                  ))}

                  {dayReviews.map((review) => (
                    <div
                      key={review.id}
                      className="min-w-0 max-w-full overflow-hidden"
                    >
                      <ReviewCardMini
                        review={review}
                        onToggle={() => onToggleReview(review.id)}
                      />
                    </div>
                  ))}

                  {dayStudies.length === 0 && dayReviews.length === 0 && (
                    <div className="md:hidden py-6 text-center text-xs text-muted-foreground opacity-60 flex flex-col items-center gap-1">
                      <CalendarIcon size={16} />
                      Nada registrado
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-2 border-t bg-card/80 backdrop-blur-sm min-w-0">
                <button
                  onClick={() => onAddStudy(day)}
                  className="w-full py-2 text-xs rounded-md border border-dashed text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition truncate"
                >
                  <Plus size={12} className="inline mr-1" />
                  Adicionar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
