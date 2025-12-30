import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Calendar, Trash2 } from 'lucide-react';
import { useStudy } from '@/contexts/StudyContext';
import { toast } from "sonner";

export default function Configuracoes() {
  const { algorithmSettings, updateAlgorithmSettings } = useStudy();
  const [settings, setSettings] = useState(algorithmSettings);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    updateAlgorithmSettings(settings);
    // [CORREÇÃO] Mensagem de sucesso correta
    toast.success("Configurações salvas!", {
      description: "O algoritmo de revisão foi atualizado."
    });
  };

  return (
    <MainLayout title="Configurações">
      <div className="max-w-4xl space-y-6 animate-fade-in pb-10">
        {/* Card do Algoritmo */}
        <Card>
             <CardHeader>
                <CardTitle className="text-lg">Personalizar Algoritmo</CardTitle>
                <CardDescription>Defina os intervalos de dias para as revisões espaçadas.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="first" className="text-xs text-muted-foreground">1ª Revisão</Label>
                      <Input
                        id="first"
                        type="number"
                        min={1}
                        value={settings.firstInterval}
                        onChange={(e) => setSettings(prev => ({ ...prev, firstInterval: parseInt(e.target.value) || 1 }))}
                        className="w-20 h-12 text-center text-lg font-semibold"
                      />
                    </div>
                    <span className="text-muted-foreground mt-6">dia(s)</span>
                  </div>
                  
                  <ArrowRight className="text-muted-foreground mt-6" size={20} />

                  <div className="flex items-center gap-3">
                    <div className="space-y-1.5">
                       <Label htmlFor="second" className="text-xs text-muted-foreground">2ª Revisão</Label>
                       <Input
                        id="second"
                        type="number"
                        min={1}
                        value={settings.secondInterval}
                        onChange={(e) => setSettings(prev => ({ ...prev, secondInterval: parseInt(e.target.value) || 1 }))}
                        className="w-20 h-12 text-center text-lg font-semibold"
                       />
                    </div>
                    <span className="text-muted-foreground mt-6">dias</span>
                  </div>

                  <ArrowRight className="text-muted-foreground mt-6" size={20} />

                   <div className="flex items-center gap-3">
                    <div className="space-y-1.5">
                       <Label htmlFor="third" className="text-xs text-muted-foreground">3ª Revisão</Label>
                       <Input
                        id="third"
                        type="number"
                        min={1}
                        value={settings.thirdInterval}
                        onChange={(e) => setSettings(prev => ({ ...prev, thirdInterval: parseInt(e.target.value) || 1 }))}
                        className="w-20 h-12 text-center text-lg font-semibold"
                       />
                    </div>
                    <span className="text-muted-foreground mt-6">dias</span>
                  </div>

                  <Button onClick={handleSave} className="ml-auto mt-6">
                    Salvar Alterações
                  </Button>
                </div>
             </CardContent>
        </Card>
        
        {/* Card de Preferências */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preferências</CardTitle>
            <CardDescription>Configure notificações e integrações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Notificações</Label>
                <p className="text-sm text-muted-foreground">Receba lembretes sobre revisões pendentes</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
               <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Calendar size={20} className="text-muted-foreground" />
                </div>
                <div className="space-y-0.5">
                  <Label className="font-medium">Google Calendar</Label>
                  <p className="text-sm text-muted-foreground">Sincronize suas revisões com o calendário</p>
                </div>
               </div>
               <Button variant="outline">Conectar</Button>
            </div>
          </CardContent>
        </Card>

        {/* --- NOVA ÁREA: ZONA DE PERIGO (DEV TOOLS) --- */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-lg text-red-600 flex items-center gap-2">
               <Trash2 size={20} /> Zona de Perigo (Dev Only)
            </CardTitle>
            <CardDescription>
              Utilize estas opções caso encontre inconsistências ou bugs nos dados salvos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={() => {
                if(confirm("Tem certeza? Isso apagará TODOS os seus estudos e revisões locais.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Resetar Todos os Dados (Factory Reset)
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}