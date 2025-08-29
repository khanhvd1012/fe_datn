import axios from "axios";
import type { IDashboardStats } from "../interface/dashboard";

const API_URL = import.meta.env.VITE_API_URL;

export const getDashboardStats = async (params = {}): Promise<IDashboardStats> => {
    try {
        const response = await axios.get(`${API_URL}/dashboards/stats`, { params });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
};
