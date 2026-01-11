import { api } from "./index";

export function getReviews() {
  return api.get("/reviews");
}

export function toggleReview(reviewId: string) {
  return api.patch(`/reviews/${reviewId}/toggle`);
}

export function deleteReview(reviewId: string) {
  return api.delete(`/reviews/${reviewId}`);
}
