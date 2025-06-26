import axios from "axios";
import type { IProduct } from "../interface/product";

const API = "http://localhost:8080/api/products";

// ✅ Lấy toàn bộ sản phẩm
export const getProducts = async (): Promise<IProduct[]> => {
  const { data } = await axios.get(API);
  return data;
};

// ✅ Lấy sản phẩm theo ID
export const getProductById = async (id: string): Promise<IProduct> => {
  const { data } = await axios.get(`${API}/${id}`);
  return data;
};

// ✅ Thêm sản phẩm mới (LOẠI BỎ _id, createdAt, updatedAt để tránh lỗi)
export const addProduct = async (
  product: Omit<IProduct, "_id" | "createdAt" | "updatedAt">
) => {
  console.log("📤 Sending product:", product); // ✅ Log debug để kiểm tra dữ liệu gửi đi
  const { data } = await axios.post(API, product);
  return data;
};

// ✅ Cập nhật sản phẩm
export const updateProduct = async (
  id: string,
  product: Partial<IProduct>
) => {
  const { data } = await axios.put(`${API}/${id}`, product);
  return data;
};

// ✅ Xóa sản phẩm
export const deleteProduct = async (id: string) => {
  const { data } = await axios.delete(`${API}/${id}`);
  return data;
};

// ✅ Lấy sản phẩm theo thương hiệu
export const getProductsByBrand = async (brandId: string) => {
  const { data } = await axios.get(`${API}?brand=${brandId}`);
  return data.data.products; // hoặc data.products tùy backend trả về
};
