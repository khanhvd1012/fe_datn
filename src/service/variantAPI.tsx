import axios from "axios";
import type { IVariant } from "../interface/variant";

const API_URL = import.meta.env.VITE_API_URL;

export const getVariants = async (): Promise<IVariant[]> => {
    try {
        const response = await axios.get(`${API_URL}/variants`);
        return response.data;
    } catch (error) {
        console.error("Error fetching variants:", error);
        throw error;
    }
};

export const getVariantById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/variants/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching variant:", error);
        throw error;
    }
}

export const addVariant = async (variant: IVariant) => {
    try {
        const response = await axios.post(`${API_URL}/variants`, variant);
        return response.data;
    } catch (error) {
        console.error("Error creating variant:", error);
        throw error;
    }
}

export const updateVariant = async (id: string, variant: Partial<Omit<IVariant, '_id' | 'createdAt' | 'updatedAt'>>) => {
    try {
        const response = await axios.put(`${API_URL}/variants/${id}`, variant);
        return response.data;
    } catch (error) {
        console.error("Error updating variant:", error);
        throw error;
    }
}

export const deleteVariant = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/variants/${id}`);
        return {
            message: "Variant deleted successfully",
            status: 200
        };
    } catch (error) {
        console.error("Error deleting variant:", error);
        throw error;
    }
}
