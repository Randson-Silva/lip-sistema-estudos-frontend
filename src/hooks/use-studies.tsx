import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudies,
  createStudy,
  updateStudy,
  deleteStudy,
} from "@/http/api/study";
import type { StudyDTO } from "@/http/api/study";
import { toast } from "sonner";

export function useStudies() {
  const queryClient = useQueryClient();

  // GET: Buscar todos os estudos
  const {
    data: studies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["studies"],
    queryFn: async () => {
      const response = await getStudies();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // POST: Criar novo estudo
  const createMutation = useMutation({
    mutationFn: createStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      toast.success("Estudo registrado!", {
        description: "Registro salvo com sucesso no histórico.",
      });
    },
    onError: (error: Error) => {
      toast.error("Erro ao registrar estudo", {
        description: error.message || "Tente novamente.",
      });
    },
  });

  // PUT: Atualizar estudo existente
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StudyDTO }) =>
      updateStudy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      toast.success("Atualizado!", {
        description: "Registro atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar", {
        description: error.message || "Tente novamente.",
      });
    },
  });

  // DELETE: Remover estudo
  const deleteMutation = useMutation({
    mutationFn: deleteStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      toast.success("Estudo removido!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao deletar", {
        description: error.message || "Tente novamente.",
      });
    },
  });

  return {
    studies,
    isLoading,
    error,
    createStudy: createMutation.mutate,
    updateStudy: updateMutation.mutate,
    deleteStudy: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
