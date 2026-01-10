import { useStudyForm } from '@/hooks/use-study-form';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SuccessModal } from '@/components/ui/success-modal';
import { Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useDisciplines } from '@/contexts/DisciplineContext';
import { useNavigate } from 'react-router-dom';

export default function RegistrarEstudo() {
  const navigate = useNavigate();
  const {
    form,
    onSubmit,
    showSuccess,
    successMessage,
    handleCloseSuccess,
    isEditing
  } = useStudyForm();

  const { disciplines } = useDisciplines();

  return (
    <MainLayout title={isEditing ? "Editar Estudo" : "Novo Registro"}>
      <Card className="max-w-4xl animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              {isEditing ? "Editar Detalhes" : "Detalhes do Estudo"}
            </CardTitle>
            <CardDescription>
              {isEditing ? "Altere as informações abaixo." : "Preencha os dados para gerar as revisões."}
            </CardDescription>
          </div>
          {isEditing && (
            <Button variant="ghost" onClick={() => navigate('/home')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* DISCIPLINA */}
                <FormField
                  control={form.control}
                  name="disciplineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disciplina</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {disciplines.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TEMPO */}
                <FormField
                  control={form.control}
                  name="timeSpent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo Dedicado</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type="time" className="h-12 pr-12" {...field} />
                        </FormControl>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">hrs</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DATA */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>Data do Estudo</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-12 w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            locale={ptBR}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* TEMA */}
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema/Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Padrões de Projeto (Singleton)" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OBSERVAÇÕES */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (Opcionais)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dificuldades encontradas, links úteis..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="px-8 min-w-[200px]">
                  {isEditing ? "ATUALIZAR REGISTRO" : "SALVAR ESTUDO"}
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>

      <SuccessModal
        open={showSuccess}
        onClose={handleCloseSuccess}
        title={isEditing ? "Sucesso!" : "Estudo Agendado!"}
        message={successMessage}
      />
    </MainLayout>
  );
}