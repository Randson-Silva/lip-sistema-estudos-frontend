import { Check } from 'lucide-react';
import { Review, DisciplineColor } from '@/types/study';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ReviewCardProps {
  review: Review;
  variant: 'today' | 'overdue' | 'completed';
  onToggle?: () => void;
}

const colorClasses: Record<DisciplineColor, string> = {
  blue: 'bg-discipline-blue',
  purple: 'bg-discipline-purple',
  green: 'bg-discipline-green',
  red: 'bg-discipline-red',
  orange: 'bg-discipline-orange',
  navy: 'bg-discipline-navy',
};

const textColorClasses: Record<DisciplineColor, string> = {
  blue: 'text-discipline-blue',
  purple: 'text-discipline-purple',
  green: 'text-discipline-green',
  red: 'text-discipline-red',
  orange: 'text-discipline-orange',
  navy: 'text-discipline-navy',
};

export function ReviewCard({ review, variant, onToggle }: ReviewCardProps) {
  const getOverdueLabel = (days: number) => {
    if (days === 1) return 'Atrasado: Ontem';
    return `Atrasado: ${days} dias`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg transition-all duration-200",
        variant === 'overdue' && "bg-destructive/5",
        variant === 'completed' && "opacity-70",
        variant === 'today' && "bg-card hover:bg-muted/50"
      )}
    >
      {/* Color Bar */}
      <div 
        className={cn(
          "w-1 h-14 rounded-full",
          variant === 'completed' ? 'bg-muted-foreground/30' : colorClasses[review.disciplineColor]
        )} 
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span 
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            variant === 'completed' 
              ? 'text-muted-foreground' 
              : variant === 'overdue'
              ? 'text-destructive'
              : textColorClasses[review.disciplineColor]
          )}
        >
          {review.discipline}
        </span>
        <p 
          className={cn(
            "font-medium text-foreground mt-1",
            variant === 'completed' && "line-through text-muted-foreground"
          )}
        >
          {review.topic}
        </p>
      </div>

      {/* Overdue Badge */}
      {variant === 'overdue' && review.daysOverdue && (
        <Badge 
          variant="outline" 
          className="border-primary text-primary text-xs font-medium px-3 py-1 rounded-full"
        >
          {getOverdueLabel(review.daysOverdue)}
        </Badge>
      )}

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0",
          variant === 'completed' 
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary"
        )}
      >
        {variant === 'completed' && <Check size={16} strokeWidth={3} />}
      </button>
    </div>
  );
}
