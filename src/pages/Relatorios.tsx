import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { useStudy } from '@/contexts/StudyContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';

const chartData = [
  { name: 'Java', hours: 18, color: 'hsl(356, 89%, 68%)' },
  { name: 'SQL', hours: 12, color: 'hsl(230, 50%, 25%)' },
  { name: 'Eng. Soft', hours: 8, color: 'hsl(0, 0%, 60%)' },
  { name: 'Redes', hours: 4, color: 'hsl(356, 70%, 75%)' },
];

export default function Relatorios() {
  const { getReviewsCompleted, getTotalHours, getPendingReviews } = useStudy();

  const metrics = [
    {
      icon: Check,
      label: 'Revisões Feitas',
      value: getReviewsCompleted(),
      badge: '+12%',
      badgeColor: 'text-green-600 bg-green-50',
      iconBg: 'bg-primary/10 text-primary',
    },
    {
      icon: Clock,
      label: 'Horas Totais',
      value: `${getTotalHours()}h`,
      iconBg: 'bg-foreground/10 text-foreground',
    },
    {
      icon: AlertCircle,
      label: 'Pendentes',
      value: getPendingReviews(),
      iconBg: 'bg-primary/10 text-primary',
    },
  ];

  return (
    <MainLayout title="Relatórios">
      <Card className="max-w-4xl animate-fade-in">
        <CardContent className="pt-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="border shadow-none">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${metric.iconBg} flex items-center justify-center`}>
                    <metric.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                  {metric.badge && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${metric.badgeColor}`}>
                      {metric.badge}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Tempo por Disciplina</h3>
            <Card className="border shadow-none">
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 20 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis hide />
                    <Bar 
                      dataKey="hours" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={80}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList 
                        dataKey="hours" 
                        position="top" 
                        formatter={(value: number) => `${value}h`}
                        style={{ fontSize: 12, fontWeight: 600, fill: 'hsl(var(--foreground))' }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
