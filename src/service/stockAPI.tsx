import axios from "axios";
import type { IStock, IStockHistory } from "../interface/stock";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy danh sách tất cả kho
export const getAllStock = async (): Promise<IStock[]> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/stocks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching all stock:", error);
        throw error;
    }
};

// Cập nhật số lượng tồn kho
export const updateStock = async (id: string, data: { quantity_change: number; reason: string }): Promise<IStockHistory> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/stocks/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error updating stock:", error);
        throw error;
    }
};

// Lấy toàn bộ lịch sử kho
export const getAllStockHistory = async (): Promise<IStockHistory[]> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/stocks/history`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching stock history:", error);
        throw error;
    }
};

// Xoá một bản ghi lịch sử kho
export const deleteStockHistory = async (id: string): Promise<{ message: string }> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/stocks/history/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting stock history:", error);
        throw error;
    }
};

// Lấy chi tiết một bản ghi lịch sử kho
export const getOneStockHistory = async (id: string): Promise<IStockHistory> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/stocks/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching stock history by ID:", error);
        throw error;
    }
};
