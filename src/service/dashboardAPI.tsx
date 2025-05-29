import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface DashboardStats {
    totalProducts: number;
    productsByCategory: {
        _id: string;
        count: number;
        category: {
            name: string;
        }[];
    }[];
    topProducts: {
        _id: string;
        name: string;
        totalSales: number;
        totalRevenue: number;
    }[];
    totalOrders: number;
    monthlyRevenue: number;
    ordersByDate: {
        date: string;
        orders: number;
    }[];
    totalUsers: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const response = await axios.get(`${API_URL}/dashboard/stats`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
};
