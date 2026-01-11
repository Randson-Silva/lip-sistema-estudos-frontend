import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { MainLayout } from "@/components/layout/MainLayout";
import { CalendarGrid } from "@/components/study/CalendarGrid";
import { Button } from "@/components/ui/button";

import { FileText, Loader2 } from "lucide-react";
import { useStudies } from "@/hooks/use-studies";
import { downloadPdfReport } from "@/http/api/report";
import { toast } from "sonner";

import type { StudyRecord } from "@/types/study";

export default function Home() {
  const navigate = useNavigate();

  const { studies, isLoading } = useStudies();

  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEditStudy = (study: StudyRecord) => {
    navigate(`/registrar-estudo?edit=${study.id}`);
  };

  const handleAddStudy = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    navigate(`/registrar-estudo?date=${dateStr}`);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await downloadPdfReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = `cronograma-${format(new Date(), "yyyy-MM-dd")}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PDF baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar PDF", {
        description: "Tente novamente em instantes.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Tela Inicial">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Tela Inicial">
      <section className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Cronograma Semanal
            </h2>
            <span className="text-sm text-muted-foreground capitalize">
              {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>

          <div className="border rounded-xl bg-card p-4 shadow-sm overflow-x-auto">
            <CalendarGrid
              studies={studies}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onEditStudy={handleEditStudy}
              onAddStudy={handleAddStudy}
            />
          </div>
        </div>

        <div className="flex justify-start pt-4">
          <Button
            onClick={handleExport}
            disabled={isExporting || studies.length === 0}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
            size="lg"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText size={18} />
            )}
            {isExporting ? "Gerando..." : "Baixar Cronograma em PDF"}
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
