import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSettings,
  updateSettings,
  type UserSettings,
} from "@/http/api/settings";
import { toast } from "sonner";

export function useSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await getSettings();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserSettings) => updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Configurações salvas!", {
        description:
          "Os novos intervalos serão aplicados aos próximos estudos.",
      });
    },
    onError: () => {
      toast.error("Erro ao salvar configurações");
    },
  });

  const getRevisionLabel = (revisionNumber: number): string => {
    if (!settings) return `Revisão ${revisionNumber}`;

    const intervals = [
      settings.firstRevisionInterval,
      settings.secondRevisionInterval,
      settings.thirdRevisionInterval,
    ];

    const interval = intervals[revisionNumber - 1];
    return `${revisionNumber}ª Revisão`;
  };

  return {
    settings: settings || {
      firstRevisionInterval: 1,
      secondRevisionInterval: 7,
      thirdRevisionInterval: 14,
    },
    isLoading,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    getRevisionLabel,
  };
}
