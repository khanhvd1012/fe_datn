import axios from "axios";
import type { IColor } from "../interface/color";

const API_URL = import.meta.env.VITE_API_URL;

export const getColors = async (): Promise<IColor[]> => {
    try {
        const response = await axios.get(`${API_URL}/colors`);
        return response.data.colors;
    } catch (error) {
        console.error("Error fetching colors:", error);
        throw error;
    }
}

export const getColorById = async (id: string): Promise<IColor> => {
    try {
        const response = await axios.get(`${API_URL}/colors/${id}`);
        return response.data.color;
    } catch (error) {
        console.error("Error fetching color:", error);
        throw error;
    }
}

export const createColor = async (color: Omit<IColor, '_id' | 'createdAt' | 'updatedAt'>): Promise<IColor> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/colors`, color, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating color:", error);
        throw error;
    }
}

export const updateColor = async (id: string, color: Partial<Omit<IColor, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IColor> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/colors/${id}`, color, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating color:", error);
        throw error;
    }
}

export const deleteColor = async (id: string): Promise<IColor> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/colors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting color:", error);
        throw error;
    }
}