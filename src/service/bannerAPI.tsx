import axios from "axios";
import type { IBanner } from "../interface/banner";

const API_URL = import.meta.env.VITE_API_URL;

export const getBanners = async (): Promise<IBanner[]> => {
    try {
        const response = await axios.get(`${API_URL}/banners`);
        return response.data;
    } catch (error) {
        console.error("Error fetching banners:", error);
        throw error;
    }
}

export const getBannerById = async (id: string): Promise<IBanner> => {
    try {
        const response = await axios.get(`${API_URL}/banners/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching banner:", error);
        throw error;
    }
}

export const createBanner = async (banner: FormData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/banners`, banner, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating banner:", error);
        throw error;
    }
}

export const updateBanner = async (id: string, banner: FormData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/banners/${id}`, banner, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating banner:", error);
        throw error;
    }
}

export const deleteBanner = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/banners/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting banner:", error);
        throw error;
    }
}

export const toggleBannerStatus = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/banners/${id}/toggle-status`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error toggling banner status:", error);
        throw error;
    }
}
