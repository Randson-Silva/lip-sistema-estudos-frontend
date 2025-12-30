import { Badge } from "@/components/ui/badge";
import { StudyRecord } from "@/types/study";
import { getDisciplineTheme } from "@/lib/constants";
import { getDiscipline } from "@/lib/utils"; // Importamos o helper
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface StudyCardProps {
  study: StudyRecord;
  onClick?: () => void;
}

export function StudyCard({ study, onClick }: StudyCardProps) {
  // 1. CORREÇÃO: Buscamos os dados completos (nome, cor) usando o ID
  const discipline = getDiscipline(study.disciplineId);
  
  // 2. CORREÇÃO: Usamos a cor retornada pelo helper
  const theme = getDisciplineTheme(discipline.color);

  return (
    <div 
      onClick={onClick}
      className={cn(
        "cursor-pointer group relative flex flex-col gap-1.5 p-3 rounded-md border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
        `border-l-[3px] ${theme.border}`
      )}
      role="button"
      tabIndex={0}
      title="Clique para editar"
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <div className="min-w-0">
          <Badge 
            variant="secondary" 
            className={cn(
              "px-2 py-0.5 text-[11px] font-bold tracking-wide truncate block w-fit max-w-full", 
              theme.badge
            )}
            title={discipline.name} // CORREÇÃO: Usamos discipline.name
          >
            {discipline.name} 
          </Badge>
        </div>

        <Pencil 
          size={14} 
          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" 
        />
      </div>
      
      <h4 className="text-sm font-medium leading-tight line-clamp-2 text-foreground/90">
        {study.topic}
      </h4>
    </div>
  );
}