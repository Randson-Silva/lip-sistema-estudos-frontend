import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, toggleReview } from "@/http/api/review";
import { toast } from "sonner";

export function useReviews() {
  const queryClient = useQueryClient();

  // GET: Buscar todas as revisões
  const {
    data: reviews = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await getReviews();
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // PATCH: Marcar/desmarcar revisão como concluída
  const toggleMutation = useMutation({
    mutationFn: toggleReview,
    onMutate: async (reviewId) => {
      // Otimistic Update
      await queryClient.cancelQueries({ queryKey: ["reviews"] });
      const previous = queryClient.getQueryData(["reviews"]);

      queryClient.setQueryData(
        ["reviews"],
        (old: object & { id; completed }[]) =>
          old.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  completed: !r.completed,
                  completedAt: !r.completed ? new Date().toISOString() : null,
                }
              : r
          )
      );

      return { previous };
    },
    onError: (err, reviewId, context) => {
      queryClient.setQueryData(["reviews"], context.previous);
      toast.error("Erro ao atualizar revisão");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  // Filtros úteis
  const overdueReviews = reviews.filter(
    (r) => !r.completed && new Date(r.dueDate) < new Date()
  );

  const todayReviews = reviews.filter((r) => {
    const today = new Date().toISOString().split("T")[0];
    return !r.completed && r.dueDate === today;
  });

  const completedReviews = reviews.filter((r) => r.completed);

  return {
    reviews,
    overdueReviews,
    todayReviews,
    completedReviews,
    isLoading,
    error,
    toggleReview: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
}
