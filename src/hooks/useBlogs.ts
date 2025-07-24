import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNews, deleteNews, getNews, getNewsById, updateNews } from "../service/blogsAPI";
import type { IBlogs } from "../interface/blogs";


// Lấy tất cả tin tức
export const useGetNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: getNews,
  });
};

// Lấy tin tức theo ID
export const useGetNewsById = (id: string) => {
  return useQuery<IBlogs>({
    queryKey: ["news", id],
    queryFn: () => getNewsById(id),
    enabled: !!id,
  });
};

// Tạo mới tin tức
export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// Cập nhật tin tức
export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// Xoá tin tức
export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};
