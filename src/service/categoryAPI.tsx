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

export const addCategory = async (category: FormData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/categories`, category, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};


export const updateCategory = async (
    id: string,
    category: FormData
) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/categories/${id}`, category, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data", 
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/categories/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            message: "Category deleted successfully",
            status: 200
        };
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}
