import axios from "axios";
import type { ISize } from "../interface/size";

const API_URL = import.meta.env.VITE_API_URL;

export const getSizes = async () => {
    try {
        const response = await axios.get(`${API_URL}/sizes`);
        console.log("Fetched sizes:", response.data);
        return response.data
    } catch (error) {
        console.error("Error fetching sizes:", error);
        throw error;
    }
}

export const getSizeById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/sizes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching size:", error);
        throw error;
    }
}

export const addSize = async (size: ISize) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/sizes`, size, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating size:", error);
        throw error;
    }
}

export const updateSize = async (id: string, size: Partial<Omit<ISize, '_id' | 'createdAt' | 'updatedAt'>>) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/sizes/${id}`, size, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating size:", error);
        throw error;
    }
}

export const deleteSize = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/sizes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            message: "Size deleted successfully",
            status: 200
        };
    } catch (error) {
        console.error("Error deleting size:", error);
        throw error;
    }
}
