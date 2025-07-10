import axios from "axios";
import type { IReview } from "../interface/review";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy tất cả đánh giá theo sản phẩm
export const getProductReviews = async (product_id: string): Promise<IReview[]> => {
  try {
    const response = await axios.get(`${API_URL}/reviews/${product_id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const getAllReviews = async (): Promise<IReview[]> => {
  try {
    const response = await axios.get(`${API_URL}/reviews`);
    return response.data.reviews;
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    throw error;
  }
}

// Tạo đánh giá mới
export const createReview = async (review: Omit<IReview, "_id" | "createdAt" | "updatedAt">) => {
  try {
    const response = await axios.post(`${API_URL}/reviews`, review);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Cập nhật đánh giá
export const updateReview = async (
  id: string,
  review: Partial<Omit<IReview, "_id" | "createdAt" | "updatedAt">>
) => {
  try {
    const response = await axios.put(`${API_URL}/reviews/${id}`, review);
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// Xóa đánh giá
export const deleteReview = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

// Admin trả lời đánh giá
export const replyToReview = async (id: string, reply: string) => {
  try {
    const response = await axios.post(`${API_URL}/reviews/${id}`, { reply });
    return response.data;
  } catch (error) {
    console.error("Error replying to review:", error);
    throw error;
  }
};
