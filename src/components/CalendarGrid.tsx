import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StudyRecord } from '@/types/study';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface CalendarGridProps {
  studies: StudyRecord[]; 
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onEditStudy: (study: StudyRecord) => void;
  onAddStudy: (date: Date) => void;
  selectedDate: Date | null;
}

export function CalendarGrid({
  studies,
  currentDate,
  onEditStudy,
  onAddStudy,
}: CalendarGridProps) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const getStudiesForDate = (date: Date) => {
    return studies.filter((study) => 
      isSameDay(new Date(study.date), date)
    );
  };

  return (
    <div className="grid grid-cols-7 gap-4 min-w-[800px]">
      {weekDays.map((day) => (
        <div key={day.toString()} className="text-center space-y-2">
          <div className="font-medium text-muted-foreground capitalize">
            {format(day, 'EEE', { locale: ptBR })}
          </div>
          <div className={cn(
            "mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold",
            isSameDay(day, new Date()) 
              ? "bg-primary text-primary-foreground" 
              : "text-foreground"
          )}>
            {format(day, 'd')}
          </div>
        </div>
      ))}

      {/* Colunas de Conteúdo */}
      {weekDays.map((day) => {
        const dayStudies = getStudiesForDate(day);
        
        return (
          <div key={day.toString()} className="h-[500px] border-l first:border-l-0 border-border/50 bg-muted/5 rounded-lg p-2 flex flex-col gap-2 group hover:bg-muted/10 transition-colors">
            
            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-2">
                {dayStudies.map((study) => (
                  <Card 
                    key={study.id} 
                    className="cursor-pointer hover:border-primary transition-colors shadow-sm"
                    onClick={() => onEditStudy(study)}
                    style={{ borderLeftColor: study.disciplineColor, borderLeftWidth: '4px' }}
                  >
                    <CardContent className="p-3 space-y-1">
                      <div className="font-semibold text-xs truncate" title={study.discipline}>
                        {study.discipline} {}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {study.topic}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <button
              onClick={() => onAddStudy(day)}
              className="w-full py-2 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
              title="Adicionar estudo neste dia"
            >
              <Plus size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}