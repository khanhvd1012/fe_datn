import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  replyToReview,
  getAllReviews
} from '../service/reviewAPI';
import type { IReview } from '../interface/review';

// Lấy danh sách đánh giá theo sản phẩm
export const useProductReviews = (product_id: string) => {
  return useQuery({
    queryKey: ['reviews', product_id],
    queryFn: () => getProductReviews(product_id || ''),
    enabled: !!product_id
  });
};

// Lấy tất cả đánh giá (dành cho admin)
export const useReviews = () =>{
  return useQuery({
      queryKey: ['reviews'],
      queryFn: getAllReviews
    });
}

// Thêm đánh giá mới
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: Omit<IReview, '_id' | 'createdAt' | 'updatedAt'>) => createReview(review),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_id] });
    }
  });
};

// Cập nhật đánh giá
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; review: Partial<Omit<IReview, '_id' | 'createdAt' | 'updatedAt'>> }) =>
      updateReview(data.id, data.review),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.review.product_id] });
    }
  });
};

// Xóa đánh giá
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; product_id: string }) => deleteReview(data.id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_id] });
    }
  });
};

// Admin trả lời đánh giá
export const useReplyToReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; reply: string; product_id: string }) =>
      replyToReview(data.id, data.reply),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_id] });
    }
  });
};
