import axios from "axios";
import type { IVariant } from "../interface/variant";

const API_URL = import.meta.env.VITE_API_URL;

export const getVariants = async (): Promise<IVariant[]> => {
    try {
        const response = await axios.get(`${API_URL}/variants`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching variants:", error);
        throw error;
    }
};

export const getVariantById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/variants/${id}`);
        console.log("Fetched variant:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching variant:", error);
        throw error;
    }
}

export const addVariant = async (variant: FormData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/variants`, variant, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data" 
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating variant:", error);
        throw error;
    }
}

export const updateVariant = async (id: string, variant: FormData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/variants/${id}`, variant, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating variant:", error);
        throw error;
    }
}

export const deleteVariant = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/variants/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            message: "Variant deleted successfully",
            status: 200
        };
    } catch (error) {
        console.error("Error deleting variant:", error);
        throw error;
    }
}