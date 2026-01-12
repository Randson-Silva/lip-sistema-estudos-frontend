import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useStudies } from "@/hooks/use-studies";
import { useReviews } from "@/hooks/use-reviews";
import { useDisciplines } from "@/contexts/DisciplineContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Loader2,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadFullReportPdf } from "@/http/api/report";

export default function Relatorios() {
  const { studies } = useStudies();
  const { allReviews, statistics } = useReviews();
  const { disciplines } = useDisciplines();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Chama a URL específica de Relatório (com estatísticas)
      const response = await downloadFullReportPdf();

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-completo-${format(
        new Date(),
        "dd-MM-yyyy"
      )}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Relatório gerado!");
    } catch (error) {
      toast.error("Erro ao gerar relatório");
    } finally {
      setIsExporting(false);
    }
  };

  // 1. Processamento de dados: Estudo por Disciplina (Pie Chart)
  const disciplineData = useMemo(() => {
    const data: Record<
      string,
      { name: string; minutes: number; color: string }
    > = {};

    studies.forEach((s) => {
      const disc = disciplines.find((d) => d.id === String(s.disciplineId));
      const name = disc?.name || "Outros";
      const color = disc?.color || "#8884d8";

      if (!data[name]) data[name] = { name, minutes: 0, color };
      const [hours, minutes] = s.timeSpent.split(":").map(Number);
      data[name].minutes += hours * 60 + minutes;
    });

    return Object.values(data);
  }, [studies, disciplines]);

  // 2. Processamento de dados: Evolução nos últimos 7 dias (Bar Chart)
  const last7DaysData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");

      const dayStudies = studies.filter((s) => s.date === dateStr);
      const totalMinutes = dayStudies.reduce((acc, s) => {
        const [h, m] = s.timeSpent.split(":").map(Number);
        return acc + h * 60 + m;
      }, 0);

      return {
        label: format(date, "EEE", { locale: ptBR }),
        horas: Number((totalMinutes / 60).toFixed(1)),
      };
    });
  }, [studies]);

  const totalMinutes = studies.reduce((acc, s) => {
    const [h, m] = s.timeSpent.split(":").map(Number);
    return acc + h * 60 + m;
  }, 0);

  const completedReviews = allReviews.filter((r) => r.completed).length;
  const pendingReviews = allReviews.filter((r) => !r.completed).length;

  return (
    <MainLayout title="Relatórios e Desempenho">
      <div className="space-y-8">
        <div className="flex justify-end">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText size={18} />
            )}
            Exportar Relatório PDF
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </div>
              <p className="text-xs text-muted-foreground">
                Acumulado de estudos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tópicos Estudados
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studies.length}</div>
              <p className="text-xs text-muted-foreground">
                Conteúdos registrados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Revisões Feitas
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedReviews}</div>
              <p className="text-xs text-muted-foreground">Ciclos concluídos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Conclusão
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allReviews.length > 0
                  ? Math.round((completedReviews / allReviews.length) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Eficiência de revisão
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Carga Horária Semanal</CardTitle>
              <CardDescription>
                Horas de estudo nos últimos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7DaysData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" />
                  <YAxis unit="h" />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="horas"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Distribuição por Disciplina</CardTitle>
              <CardDescription>Tempo dedicado a cada matéria</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disciplineData}
                    dataKey="minutes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {disciplineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status Geral das Revisões</CardTitle>
            <CardDescription>
              Comparativo entre revisões pendentes e concluídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden flex">
                <div
                  className="bg-primary h-full transition-all"
                  style={{
                    width: `${
                      (completedReviews / (allReviews.length || 1)) * 100
                    }%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium">
                {completedReviews} de {allReviews.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Concluídas: {completedReviews}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span>Pendentes: {pendingReviews}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
