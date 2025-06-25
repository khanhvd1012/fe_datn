// hooks/useReview.ts
import { useQuery } from '@tanstack/react-query';
import { getReviewById, getReviewsByProduct } from '../service/reviewAPI';
import type { IReview } from '../interface/review';

export const useReviews = (productId: string) => {
  return useQuery<IReview[]>({
    queryKey: ['reviews', productId],
    queryFn: () => getReviewsByProduct(productId),
    enabled: !!productId, // 👈 Bảo vệ khi productId rỗng
  });
};


export const useReview = (reviewId: string) => {
    return useQuery<IReview>({
        queryKey: ['review', reviewId],
        queryFn: () => getReviewById(reviewId),
        enabled: !!reviewId
    });
};
