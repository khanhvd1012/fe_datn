import axios from "axios";
import type { IBrand } from "../interface/brand";

const API_URL = import.meta.env.VITE_API_URL;

export const getBrands = async (): Promise<IBrand[]> => {
    try {
        const response = await axios.get(`${API_URL}/brands`);
        return response.data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        throw error;
    }
}

export const getBrandById = async (id: string): Promise<IBrand> => {
    try {
        const response = await axios.get(`${API_URL}/brands/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching brand:", error);
        throw error;
    }
}

export const createBrand = async (brand: FormData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/brands`, brand, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating brand:", error);
        throw error;
    }
}

export const updateBrand = async (id: string, brand: FormData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/brands/${id}`, brand, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating brand:", error);
        throw error;
    }
}

export const deleteBrand = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/brands/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting brand:", error);
        throw error;
    }
}
