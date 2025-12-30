import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudy } from '@/contexts/StudyContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { truncateLabel, getDiscipline } from '@/lib/utils'; // [1] Importamos o helper de Lookup
import { getDisciplineTheme } from '@/lib/constants';
import { timeToDecimal } from '@/lib/study-logic';

export default function Relatorios() {
  // Consumindo os valores memoizados do Contexto
  const { 
    studyRecords, 
    totalHours, 
    reviewsCompletedCount, 
    pendingReviewsCount 
  } = useStudy();
  
  const isMobile = useIsMobile(); 

  const chartData = useMemo(() => {
    if (studyRecords.length === 0) return [];

    // [2] Reduce agora usa o ID como chave, não o nome
    const statsMap = studyRecords.reduce((acc, record) => {
      const { disciplineId, timeSpent } = record;

      // Recupera os dados frescos (Nome e Cor) usando o ID
      const disciplineInfo = getDiscipline(disciplineId);

      // Usamos o ID como chave para garantir unicidade
      if (!acc[disciplineInfo.id]) {
        acc[disciplineInfo.id] = {
          name: disciplineInfo.name, 
          hours: 0,
          color: getDisciplineTheme(disciplineInfo.color).hex
        };
      }
      
      acc[disciplineInfo.id].hours += timeToDecimal(timeSpent);
      
      return acc;
    }, {} as Record<string, { name: string; hours: number; color: string }>);

    return Object.values(statsMap)
      .map(stat => ({
        ...stat,
        hours: Number(stat.hours.toFixed(1))
      }))
      .sort((a, b) => b.hours - a.hours);

  }, [studyRecords]); 

  return (
    <MainLayout title="Relatórios e Estatísticas">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
        
        {/* Card 1: Total de Horas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Horas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Tempo acumulado de estudo</p>
          </CardContent>
        </Card>

        {/* Card 2: Revisões Feitas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisões Feitas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewsCompletedCount}</div>
            <p className="text-xs text-muted-foreground">Ciclos concluídos</p>
          </CardContent>
        </Card>

        {/* Card 3: Revisões Pendentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisões Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviewsCount}</div>
            <p className="text-xs text-muted-foreground">Precisa de atenção</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-1 md:col-span-4">
        <CardHeader>
          <CardTitle>Desempenho por Disciplina</CardTitle>
        </CardHeader>
        <CardContent className="pl-0 md:pl-2">
          {chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  
                  <XAxis 
                    dataKey="name" 
                    className="text-[10px] md:text-xs font-medium" 
                    tickLine={false} 
                    axisLine={false} 
                    stroke="hsl(var(--muted-foreground))"
                    interval={0}
                    tickFormatter={(name) => truncateLabel(name, isMobile, chartData.length)}
                  />
                  
                  <YAxis 
                    className="text-xs font-medium" 
                    tickLine={false} 
                    axisLine={false} 
                    stroke="hsl(var(--muted-foreground))"
                    unit="h"
                  />

                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    labelFormatter={(label) => label} 
                    formatter={(value: number) => [`${value} horas`, 'Tempo dedicado']}
                  />
                  
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground">
              <p>Nenhum dado registrado ainda.</p>
              <p className="text-sm">Registre seus estudos para ver o gráfico.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}