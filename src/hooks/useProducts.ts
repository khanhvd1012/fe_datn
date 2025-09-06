import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProduct, deleteProduct, getProductById, getProductBySlug, getProducts, getRelatedProducts, updateProduct } from "../service/productAPI";
import type { IProduct } from "../interface/product";

export const useProducts = () => {
  return useQuery<IProduct[]>({
    queryKey: ['products'],
    queryFn: getProducts
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
    enabled: !!id 
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: IProduct) => addProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; product: Partial<Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>> }) =>
      updateProduct(data.id, data.product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery<IProduct>({
    queryKey: ['product', 'slug', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug, 
    staleTime: 0,
  });
};

export const useRelatedProducts = (slug: string) => {
  return useQuery<IProduct[]>({
    queryKey: ['relatedProducts', slug],
    queryFn: () => getRelatedProducts(slug),
    enabled: !!slug, // chỉ gọi khi slug có giá trị
    staleTime: 0,
  });
};