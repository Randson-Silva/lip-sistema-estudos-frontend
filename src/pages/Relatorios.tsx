import { useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { truncateLabel } from "@/lib/utils";
import { getDisciplineTheme } from "@/lib/constants";
import { timeToDecimal } from "@/lib/study-logic";

import { useStudies } from "@/hooks/use-studies";
import { useReviews } from "@/hooks/use-reviews";

export default function Relatorios() {
  const isMobile = useIsMobile();

  const { studies, isLoading: isLoadingStudies } = useStudies();
  const {
    completedReviews,
    overdueReviews,
    todayReviews,
    isLoading: isLoadingReviews,
  } = useReviews();

  const totalHours = useMemo(() => {
    return studies.reduce(
      (total, record) => total + timeToDecimal(record.timeSpent),
      0
    );
  }, [studies]);

  const pendingReviewsCount = useMemo(() => {
    return overdueReviews.length + todayReviews.length;
  }, [overdueReviews, todayReviews]);

  const chartData = useMemo(() => {
    if (studies.length === 0) return [];

    const statsMap: Record<
      string,
      { name: string; hours: number; color: string }
    > = {};

    studies.forEach((record) => {
      const theme = getDisciplineTheme(record.disciplineColor);

      if (!statsMap[record.disciplineId]) {
        statsMap[record.disciplineId] = {
          name: record.disciplineName,
          hours: 0,
          color: theme.hex,
        };
      }

      statsMap[record.disciplineId].hours += timeToDecimal(
        record.timeSpent
      );
    });

    return Object.values(statsMap)
      .map((stat) => ({
        ...stat,
        hours: Number(stat.hours.toFixed(1)),
      }))
      .sort((a, b) => b.hours - a.hours);
  }, [studies]);

  if (isLoadingStudies || isLoadingReviews) {
    return (
      <MainLayout title="Relatórios e Estatísticas">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Relatórios e Estatísticas">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Horas
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalHours.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">
              Tempo acumulado de estudo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Revisões Feitas
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedReviews.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ciclos concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Revisões Pendentes
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingReviewsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Precisa de atenção
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Disciplina</CardTitle>
        </CardHeader>
        <CardContent className="pl-0 md:pl-2">
          {chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(name) =>
                      truncateLabel(name, isMobile, chartData.length)
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    unit="h"
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value} horas`,
                      "Tempo dedicado",
                    ]}
                  />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
              <p>Nenhum dado registrado ainda.</p>
              <p className="text-sm">
                Registre seus estudos para ver o gráfico.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
