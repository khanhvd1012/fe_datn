import axios from "axios";
import type { IProduct } from "../interface/product";

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (): Promise<IProduct[]> => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data.data.products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getProductById = async (id: string) => {
    try {

        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
};

export const addProduct = async (product: IProduct) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/products`, product, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const updateProduct = async (
    id: string,
    product: Partial<Omit<IProduct, "_id" | "createdAt" | "updatedAt">>
) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/products/${id}`, product, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return {
            message: "Product deleted successfully",
            status: 200,
        };
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

export const getProductsByBrand = async (brandId: string): Promise<IProduct[]> => {
    try {
        const response = await axios.get(`${API_URL}/products?brand=${brandId}`);
        return response.data.data.products;
    } catch (error) {
        console.error("Error fetching products by brand:", error);
        throw error;
    }
};

export const getProductsByCategory = async (categoryId: string): Promise<IProduct[]> => {
    try {
        const response = await axios.get(`${API_URL}/products?category=${categoryId}`);
        return response.data.data.products;
    } catch (error) {
        console.error("Error fetching products by brand:", error);
        throw error;
    }
};

export const getProductBySlug = async (slug: string): Promise<IProduct> => {
    try {
        const response = await axios.get(`${API_URL}/products/slug/${slug}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        throw error;
    }
};

export const getRelatedProducts = async (slug: string): Promise<IProduct[]> => {
  try {
    const response = await axios.get(`${API_URL}/products/${slug}/related`);
    return response.data.data; // vì BE bạn trả về { success, data }
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

