import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

export default function Configuracoes() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();

  const [intervals, setIntervals] = useState({
    firstRevisionInterval: 1,
    secondRevisionInterval: 7,
    thirdRevisionInterval: 14,
  });

  useEffect(() => {
    if (settings) {
      setIntervals({
        firstRevisionInterval: settings.firstRevisionInterval,
        secondRevisionInterval: settings.secondRevisionInterval,
        thirdRevisionInterval: settings.thirdRevisionInterval,
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings(intervals);
  };

  if (isLoading) {
    return (
      <MainLayout title="Configurações">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Configurações">
      <div className="max-w-4xl space-y-6 animate-fade-in pb-10">
        {/* Card do Algoritmo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personalizar Algoritmo</CardTitle>
            <CardDescription>
              Defina os intervalos de dias para as revisões espaçadas. As
              mudanças afetarão apenas estudos criados após esta alteração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="first"
                    className="text-xs text-muted-foreground"
                  >
                    1ª Revisão
                  </Label>
                  <Input
                    id="first"
                    type="number"
                    min={1}
                    value={intervals.firstRevisionInterval}
                    onChange={(e) =>
                      setIntervals((prev) => ({
                        ...prev,
                        firstRevisionInterval: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-20 h-12 text-center text-lg font-semibold"
                    disabled={isUpdating}
                  />
                </div>
                <span className="text-muted-foreground mt-6">dia(s)</span>
              </div>

              <ArrowRight className="text-muted-foreground mt-6" size={20} />

              <div className="flex items-center gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="second"
                    className="text-xs text-muted-foreground"
                  >
                    2ª Revisão
                  </Label>
                  <Input
                    id="second"
                    type="number"
                    min={1}
                    value={intervals.secondRevisionInterval}
                    onChange={(e) =>
                      setIntervals((prev) => ({
                        ...prev,
                        secondRevisionInterval: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-20 h-12 text-center text-lg font-semibold"
                    disabled={isUpdating}
                  />
                </div>
                <span className="text-muted-foreground mt-6">dias</span>
              </div>

              <ArrowRight className="text-muted-foreground mt-6" size={20} />

              <div className="flex items-center gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="third"
                    className="text-xs text-muted-foreground"
                  >
                    3ª Revisão
                  </Label>
                  <Input
                    id="third"
                    type="number"
                    min={1}
                    value={intervals.thirdRevisionInterval}
                    onChange={(e) =>
                      setIntervals((prev) => ({
                        ...prev,
                        thirdRevisionInterval: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-20 h-12 text-center text-lg font-semibold"
                    disabled={isUpdating}
                  />
                </div>
                <span className="text-muted-foreground mt-6">dias</span>
              </div>

              <Button
                onClick={handleSave}
                className="ml-auto mt-6"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Nota:</strong> As mudanças nos intervalos afetarão
                apenas os estudos registrados após salvar esta configuração.
                Revisões já criadas manterão seus intervalos originais.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
