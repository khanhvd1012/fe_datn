import axios from "axios";
import type { IVariant } from "../interface/variant";

const API_URL = import.meta.env.VITE_API_URL;

export const getVariant = async () => {
    try {
        const response = await axios.get(`${API_URL}/variants`);
        return response.data;
    } catch (error) {
        console.error("Error fetching:", error);
        throw error;
    }
}

export const getVariantById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/variants/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching:", error);
        throw error;
    }
}

export const addVariant = async (variant: IVariant) => {
    try {
        const response = await axios.post(`${API_URL}/variants`, variant);
        return response.data;
    } catch (error) {
        console.error("Error mutation:", error);
        throw error;
    }
}

export const updateVariant = async (id: string, variant: IVariant) => {
    try {
        const response = await axios.put(`${API_URL}/variants/${id}`, variant);
        return response.data;
    } catch (error) {
        console.error("Error mutation:", error);
        throw error;
    }
}

export const deleteVariant = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/variants/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error mutation:", error);
        throw error;
    }
}