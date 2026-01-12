import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviews,
  toggleReview,
  getReviewStatistics,
} from "@/http/api/review";
import { toast } from "sonner";
import type { Review } from "@/types/review";
import { isAfter, startOfDay, parseISO } from "date-fns";

const normalizeDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  return startOfDay(parseISO(dateStr));
};

export function useReviews() {
  const queryClient = useQueryClient();

  const {
    data: allReviews = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await getReviews();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });

  const { data: statistics } = useQuery({
    queryKey: ["reviews", "statistics"],
    queryFn: async () => {
      const response = await getReviewStatistics();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const toggleMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const review = allReviews.find((r) => r.id === reviewId);
      if (!review) return;

      const reviewDate = normalizeDate(review.dueDate);
      const today = startOfDay(new Date());

      if (!review.completed && isAfter(reviewDate, today)) {
        toast.warning("Revisão futura", {
          description:
            "Você só pode concluir revisões agendadas para hoje ou que estejam atrasadas.",
        });
        return;
      }

      return toggleReview(reviewId);
    },

    onMutate: async (reviewId) => {
      const review = allReviews.find((r) => r.id === reviewId);
      const today = startOfDay(new Date());

      if (
        review &&
        !review.completed &&
        isAfter(normalizeDate(review.dueDate), today)
      ) {
        return;
      }

      await queryClient.cancelQueries({ queryKey: ["reviews"] });
      const previous = queryClient.getQueryData<Review[]>(["reviews"]);

      queryClient.setQueryData<Review[]>(["reviews"], (old = []) =>
        old.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                completed: !r.completed,
                completedAt: !r.completed
                  ? new Date().toISOString()
                  : undefined,
              }
            : r
        )
      );

      return { previous };
    },

    onError: (err, reviewId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["reviews"], context.previous);
      }
      toast.error("Erro ao atualizar revisão", {
        description: "Ocorreu um problema na comunicação com o servidor.",
      });
    },

    onSuccess: (data) => {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "statistics"] });
      toast.success("Status atualizado!");
    },
  });

  const todayStart = startOfDay(new Date());

  const overdueReviews = allReviews.filter(
    (r) => !r.completed && normalizeDate(r.dueDate) < todayStart
  );

  const todayReviews = allReviews.filter((r) => {
    return (
      !r.completed &&
      normalizeDate(r.dueDate).getTime() === todayStart.getTime()
    );
  });

  const completedReviews = allReviews.filter((r) => r.completed);

  const overdueCount = overdueReviews.length;

  return {
    allReviews,
    overdueReviews,
    todayReviews,
    completedReviews,
    overdueCount,
    statistics,
    isLoading,
    error,
    toggleReview: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
}
