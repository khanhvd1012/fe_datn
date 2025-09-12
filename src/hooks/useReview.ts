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

/**
 * Hook lấy danh sách đánh giá theo ID sản phẩm
 * @param product_id ID của sản phẩm
 * @returns Danh sách đánh giá tương ứng với sản phẩm đó
 */
export const useProductReviews = (product_id: string) => {
  return useQuery({
    queryKey: ['reviews', product_id], // Khóa cache để phân biệt giữa các sản phẩm
    queryFn: () => getProductReviews(product_id || ''), // Gọi API lấy review theo product_id
    enabled: !!product_id // Chỉ gọi khi có product_id
  });
};

/**
 * Hook lấy tất cả đánh giá (dành cho admin)
 * @returns Tất cả các đánh giá trong hệ thống
 */
export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: getAllReviews
  });
};

/**
 * Hook tạo mới một đánh giá
 * @returns Mutation để gọi hàm tạo review
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { review: FormData; product_id: string }) =>
      createReview(data.review),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_id] });
    }
  });
};

/**
 * Hook cập nhật đánh giá
 * @returns Mutation để cập nhật nội dung đánh giá
 */
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; review: FormData; product_id: string }) =>
      updateReview(data.id, data.review),
    onSuccess: (_data, variables) => {
      // Làm mới danh sách đánh giá của sản phẩm
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_id] });
    }
  });
};

/**
 * Hook xóa một đánh giá
 * @returns Mutation để xóa đánh giá dựa theo ID
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; product_id: string }) => deleteReview(data.id),
    onSuccess: (_data, variables) => {
      // Sau khi xóa, làm mới danh sách đánh giá của sản phẩm
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_id] });
    }
  });
};

/**
 * Hook để admin trả lời một đánh giá
 * @returns Mutation cho việc thêm trả lời vào đánh giá
 */
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