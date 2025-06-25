
import axios from "axios";
import type { IReview } from "../interface/review";

const API_URL = import.meta.env.VITE_API_URL;

export const getReviewsByProduct = async (product_id: string): Promise<IReview[]> => {
  const response = await axios.get(`${API_URL}/reviews/${product_id}`);
  return response.data; // 👈 Đảm bảo backend trả mảng []
};

export const getReviewById = async (reviewId: string): Promise<IReview> => {
    try {
        const response = await axios.get(`${API_URL}/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching review:", error);
        throw error;
    }
};
