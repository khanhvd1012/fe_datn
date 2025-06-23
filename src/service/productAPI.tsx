import axios from "axios";
import type { IProduct } from "../interface/product";

const API_URL = import.meta.env.VITE_API_URL;


export const getProduct = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching:", error);
        throw error;
    }
}
export const getById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data
    } catch (error) {
        console.error("Error fetching:", error);
        throw error;
    }
}
export const addProduct = async (product: IProduct) => {
    try {
        // Ensure sizes is always an array of IDs
        const productData = {
            ...product,
            sizes: Array.isArray(product.sizes)
                ? product.sizes.map(size => typeof size === 'object' ? size._id : size)
                : []
        };
        const response = await axios.post(`${API_URL}/products`, productData);
        return response.data
    } catch (error) {
        console.error("Error mutation:", error);
        throw error;
    }
}
export const updateProduct = async (id: string, product: Partial<Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>>) => {
    try {
        // Ensure sizes is always an array of IDs
        const productData = {
            ...product,
            sizes: product.sizes
                ? (Array.isArray(product.sizes)
                    ? product.sizes.map(size => typeof size === 'object' ? size._id : size)
                    : [])
                : []
        };
        const response = await axios.put(`${API_URL}/products/${id}`, productData);
        return response.data
    } catch (error) {
        console.error("Error mutation:", error);
        throw error;
    }
}
export const deleteProduct = async (id: string) => { 
    try {
        await axios.delete(`${API_URL}/products/${id}`);
        return {
            message: "Deleted successfully",
            status: 200,
        }
    } catch (error) {
        console.error("Error mutation:", error);
        throw error;
    }
}
