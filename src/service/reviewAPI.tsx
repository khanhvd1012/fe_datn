// src/services/reviewApi.ts
import axios from "axios";
import type { IReview } from "../interface/review";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllReviews = async (): Promise<IReview[]> => {
  const response = await axios.get(`${API_URL}/reviews`);
  return response.data.reviews; // Vì backend trả về { success, reviews }
};