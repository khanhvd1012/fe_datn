import axios from "axios";
import type { ISize } from "../interface/size";

const API_URL = import.meta.env.VITE_API_URL;

interface SizesResponse {
  message: string;
  sizes: ISize[];
}

export const getSizes = async (): Promise<SizesResponse> => {
    try {
        const response = await axios.get(`${API_URL}/sizes`);
        return response.data;
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
        const response = await axios.post(`${API_URL}/sizes`, size);
        return response.data;
    } catch (error) {
        console.error("Error creating size:", error);
        throw error;
    }
}

export const updateSize = async (id: string, size: Partial<Omit<ISize, '_id' | 'createdAt' | 'updatedAt'>>) => {
    try {
        const response = await axios.put(`${API_URL}/sizes/${id}`, size);
        return response.data;
    } catch (error) {
        console.error("Error updating size:", error);
        throw error;
    }
}

export const deleteSize = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/sizes/${id}`);
        return {
            message: "Size deleted successfully",
            status: 200
        };
    } catch (error) {
        console.error("Error deleting size:", error);
        throw error;
    }
}
