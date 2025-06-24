import axios from "axios";
import type { IProduct } from "../interface/product";

const API = "http://localhost:8080/api/products";

export const getProducts = async (): Promise<IProduct[]> => {
  const { data } = await axios.get(API);
  return data;
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const { data } = await axios.get(`${API}/${id}`);
  return data;
};

export const addProduct = async (product: IProduct) => {
  const { data } = await axios.post(API, product);
  return data;
};

export const updateProduct = async (id: string, product: Partial<IProduct>) => {
  const { data } = await axios.put(`${API}/${id}`, product);
  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await axios.delete(`${API}/${id}`);
  return data;
};
