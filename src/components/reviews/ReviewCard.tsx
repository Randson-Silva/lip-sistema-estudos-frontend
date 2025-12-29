import { Check } from 'lucide-react';
import { Review } from '@/types/study';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getDisciplineTheme } from '@/lib/constants'; // [1] Conecta à fonte da verdade

interface ReviewCardProps {
  review: Review;
  variant: 'today' | 'overdue' | 'completed';
  onToggle?: () => void;
}

export function ReviewCard({ review, variant, onToggle }: ReviewCardProps) {
  // [2] Recupera o tema centralizado (Hex, Bordas, Badges)
  const theme = getDisciplineTheme(review.disciplineColor);

  const getOverdueLabel = (days: number) => {
    if (days === 1) return 'Atrasado: Ontem';
    return `Atrasado: ${days} dias`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg transition-all duration-200 border border-transparent",
        variant === 'overdue' && "bg-destructive/5 border-destructive/10", // Melhorei o feedback visual de erro
        variant === 'completed' && "opacity-60 grayscale", // Reduz destaque visual se completado
        variant === 'today' && "bg-card hover:bg-accent/50 border-border/50 shadow-sm"
      )}
    >
      {/* Color Bar - Agora usa o HEX direto da constante */}
      <div 
        className={cn(
          "w-1.5 h-12 rounded-full flex-shrink-0", // Ajustei levemente as dimensões
          variant === 'completed' && "bg-muted-foreground/30"
        )} 
        style={variant !== 'completed' ? { backgroundColor: theme.hex } : undefined}
      />

      {/* Content */}
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
          // Se não estiver completado/atrasado, usa a cor da disciplina
          style={
            variant !== 'completed' && variant !== 'overdue' 
              ? { color: theme.hex } 
              : undefined
          }
        >
          {review.discipline}
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

      {/* Overdue Badge */}
      {variant === 'overdue' && review.daysOverdue && (
        <Badge 
          variant="outline" 
          className="hidden md:inline-flex border-destructive/40 text-destructive bg-destructive/10 whitespace-nowrap"
        >
          {getOverdueLabel(review.daysOverdue)}
        </Badge>
      )}

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variant === 'completed' 
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/20 hover:border-primary hover:bg-primary/5"
        )}
        aria-label={variant === 'completed' ? "Marcar como pendente" : "Concluir revisão"}
      >
        {variant === 'completed' && <Check size={16} strokeWidth={3} />}
      </button>
    </div>
  );
}