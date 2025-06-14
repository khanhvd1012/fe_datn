import axios from "axios";
import type { ICategory } from "../interface/category";

const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

export const getCategoryById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
}

export const addCategory = async (category: ICategory) => {
    try {
        const response = await axios.post(`${API_URL}/categories`, category);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}

export const updateCategory = async (id: string, category: Partial<Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>>) => {
    try {
        const response = await axios.put(`${API_URL}/categories/${id}`, category);
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}

export const deleteCategory = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/categories/${id}`);
        return {
            message: "Category deleted successfully",
            status: 200
        };
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}
