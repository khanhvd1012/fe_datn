// src/hooks/useReview.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { IReview } from "../interface/review";

const API_URL = import.meta.env.VITE_API_URL;

export const useAllReviews = () => {
  return useQuery<IReview[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/reviews`);
      return res.data.reviews;
    },
  });
};