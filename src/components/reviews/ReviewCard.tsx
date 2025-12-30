import { Check } from 'lucide-react';
import { Review } from '@/types/study';
import { cn, getDiscipline } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getDisciplineTheme } from '@/lib/constants';
import { differenceInCalendarDays } from 'date-fns'; // Importação necessária
import { normalizeDate } from '@/lib/date-utils';   // Importação necessária

interface ReviewCardProps {
  review: Review;
  variant: 'today' | 'overdue' | 'completed';
  onToggle?: () => void;
}

export function ReviewCard({ review, variant, onToggle }: ReviewCardProps) {
  const discipline = getDiscipline(review.disciplineId);
  const theme = getDisciplineTheme(discipline.color);

  // LÓGICA VISUAL: Calculamos o atraso aqui, na hora do render
  const daysOverdue = variant === 'overdue' 
    ? differenceInCalendarDays(new Date(), normalizeDate(review.dueDate))
    : 0;

  const getOverdueLabel = (days: number) => {
    if (days <= 1) return 'Atrasado: Ontem';
    return `Atrasado: ${days} dias`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg transition-all duration-200 border border-transparent",
        variant === 'overdue' && "bg-destructive/5 border-destructive/10",
        variant === 'completed' && "opacity-60 grayscale",
        variant === 'today' && "bg-card hover:bg-accent/50 border-border/50 shadow-sm"
      )}
    >
      <div 
        className={cn(
          "w-1.5 h-12 rounded-full flex-shrink-0",
          variant === 'completed' && "bg-muted-foreground/30"
        )} 
        style={variant !== 'completed' ? { backgroundColor: theme.hex } : undefined}
      />

      <div className="flex-1 min-w-0">
        <span 
          className={cn(
            "text-[10px] md:text-xs font-bold uppercase tracking-wider",
            variant === 'completed' 
              ? 'text-muted-foreground' 
              : variant === 'overdue'
              ? 'text-destructive'
              : '' 
          )}
          style={
            variant !== 'completed' && variant !== 'overdue' 
              ? { color: theme.hex } 
              : undefined
          }
        >
          {discipline.name}
        </span>
        <p 
          className={cn(
            "font-medium text-foreground mt-0.5 text-sm md:text-base truncate pr-2",
            variant === 'completed' && "line-through text-muted-foreground"
          )}
        >
          {review.topic}
        </p>
      </div>

      {/* Badge usa a variável local 'daysOverdue' calculada acima */}
      {variant === 'overdue' && daysOverdue > 0 && (
        <Badge 
          variant="outline" 
          className="hidden md:inline-flex border-destructive/40 text-destructive bg-destructive/10 whitespace-nowrap"
        >
          {getOverdueLabel(daysOverdue)}
        </Badge>
      )}

      <button
        onClick={onToggle}
        className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variant === 'completed' 
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/20 hover:border-primary hover:bg-primary/5"
        )}
      >
        {variant === 'completed' && <Check size={16} strokeWidth={3} />}
      </button>
    </div>
  );
}