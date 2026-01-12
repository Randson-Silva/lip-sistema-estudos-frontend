import { Badge } from "@/components/ui/badge";
import { StudyRecord } from "@/types/study";
import { getDisciplineTheme } from "@/lib/constants";
import { useDisciplines } from "@/contexts/DisciplineContext";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface StudyCardProps {
  study: StudyRecord;
  onClick?: () => void;
}

export function StudyCard({ study, onClick }: StudyCardProps) {
  const { disciplines } = useDisciplines();
  const discipline = disciplines.find((d) => d.id === study.disciplineId) || {
    id: "unknown",
    name: "Desconhecido",
    color: "blue",
  };

  const theme = getDisciplineTheme(discipline.color);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={cn(
        "group cursor-pointer rounded-lg border bg-card p-3 flex flex-col gap-2 shadow-sm transition",
        "hover:shadow-md hover:scale-[1.01]",
        `border-l-4 ${theme.border}`
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <Badge
          variant="secondary"
          className={cn(
            "px-2 py-0.5 text-[10px] font-bold uppercase",
            theme.badge
          )}
        >
          {discipline.name}
        </Badge>

        <Pencil
          size={9}
          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <h4 className="text-sm font-semibold leading-snug break-words">
        {study.topic}
      </h4>

      <div className="pt-1 border-t text-xs text-muted-foreground flex justify-between">
        <span className="font-medium">{study.timeSpent}</span>
        {study.notes && <span className="italic text-[10px]">Anotações</span>}
      </div>
    </div>
  );
}
