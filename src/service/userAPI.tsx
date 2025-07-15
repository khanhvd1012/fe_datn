import axios from "axios";
import type { IShippingAddress, IUser } from "../interface/user";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy toàn bộ user (admin)
export const getAllUsers = async (): Promise<IUser[]> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/auth/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Fetched users:", response.data.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching user list:", error);
        throw error;
    }
};

export const getProfile = async (): Promise<IUser> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.user;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

// Cập nhật thông tin người dùng
export const updateProfile = async (
    id: string,
    data: Partial<Omit<IUser, "_id" | "createdAt" | "updatedAt">>
) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(`${API_URL}/auth/profile/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
    }
};

// Lấy danh sách địa chỉ giao hàng
export const getShippingAddresses = async (): Promise<IShippingAddress[]> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/auth/shipping-addresses`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching shipping addresses:", error);
        throw error;
    }
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId: string) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(
            `${API_URL}/auth/shipping-addresses/${addressId}/default`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error setting default address for ID ${addressId}:`, error);
        throw error;
    }
};

// Xóa địa chỉ giao hàng
export const deleteAddress = async (addressId: string) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(`${API_URL}/auth/shipping-addresses/${addressId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting address with ID ${addressId}:`, error);
        throw error;
    }
};
