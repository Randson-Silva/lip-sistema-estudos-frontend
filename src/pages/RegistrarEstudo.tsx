import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DISCIPLINES, DisciplineColor } from '@/types/study';
import { useStudy } from '@/contexts/StudyContext';
import { SuccessModal } from '@/components/ui/success-modal';

export default function RegistrarEstudo() {
  const { addStudyRecord } = useStudy();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    discipline: '',
    disciplineColor: '' as DisciplineColor,
    timeSpent: '01:20',
    date: undefined as Date | undefined,
    topic: '',
    notes: '',
  });

  const handleDisciplineChange = (value: string) => {
    const selected = DISCIPLINES.find(d => d.id === value);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        discipline: selected.name,
        disciplineColor: selected.color,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.discipline || !formData.date || !formData.topic) {
      return;
    }

    addStudyRecord({
      discipline: formData.discipline,
      disciplineColor: formData.disciplineColor,
      timeSpent: formData.timeSpent,
      date: format(formData.date, 'yyyy-MM-dd'),
      topic: formData.topic,
      notes: formData.notes,
    });

    setShowSuccess(true);
    
    // Reset form
    setFormData({
      discipline: '',
      disciplineColor: '' as DisciplineColor,
      timeSpent: '01:20',
      date: undefined,
      topic: '',
      notes: '',
    });
  };

  return (
    <MainLayout title="Novo Registro">
      <Card className="max-w-4xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl">Detalhes do Estudo</CardTitle>
          <CardDescription>Preencha os dados para gerar as revisões automáticas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Disciplina */}
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="discipline">Disciplina</Label>
                <Select onValueChange={handleDisciplineChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione uma disciplina..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DISCIPLINES.map(d => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tempo Dedicado */}
              <div className="space-y-2">
                <Label htmlFor="timeSpent">Tempo Dedicado</Label>
                <div className="relative">
                  <Input
                    id="timeSpent"
                    type="time"
                    value={formData.timeSpent}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeSpent: e.target.value }))}
                    className="h-12 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    hrs
                  </span>
                </div>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      {formData.date ? (
                        format(formData.date, "dd/MM/yyyy")
                      ) : (
                        <span>dd/mm/aaaa</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Tema */}
            <div className="space-y-2">
              <Label htmlFor="topic">Tema/Assunto</Label>
              <Input
                id="topic"
                placeholder="Ex: Consultas SQL"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="h-12"
              />
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (Opcionais)</Label>
              <Textarea
                id="notes"
                placeholder="Adicionar Observações.."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="px-8">
                SALVAR REGISTRO
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <SuccessModal 
        open={showSuccess} 
        onClose={() => setShowSuccess(false)} 
      />
    </MainLayout>
  );
}
