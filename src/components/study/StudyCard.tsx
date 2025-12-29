import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays } from "lucide-react";
import { StudyRecord } from "@/types/study";
import { format } from "date-fns";
import { getDisciplineTheme } from "@/lib/constants"; // [1] Importe a constante

interface StudyCardProps {
  study: StudyRecord;
}

export function StudyCard({ study }: StudyCardProps) {
  // [2] Recupere o tema em uma linha
  const theme = getDisciplineTheme(study.disciplineColor);

  return (
    <Card className={`hover:shadow-md transition-all border-l-4 ${theme.border}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={`${theme.badge} border-0`}>
            {study.discipline}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {format(new Date(study.date), "dd/MM")}
          </span>
        </div>
        <CardTitle className="text-lg font-medium leading-tight mt-2">
          {study.topic}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Clock className="w-4 h-4" />
          <span>{study.timeSpent} horas</span>
        </div>
      </CardContent>
    </Card>
  );
}