import axios from "axios";
import type { IShippingAddress, IUser } from "../interface/user";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy thông tin người dùng (cần token)
export const getAllUsers = async (): Promise<IUser[]> => {
    try {
        const response = await axios.get(`${API_URL}/auth/user`);
        console.log("Fetched users:", response.data.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const getProfileById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/auth/profile/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
};

// Cập nhật thông tin người dùng
export const updateProfile = async (
    id: string,
    data: Partial<Omit<IUser, "_id" | "createdAt" | "updatedAt">>
) => {
    try {
        const response = await axios.put(`${API_URL}/auth/profile/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
    }
};

// Lấy danh sách địa chỉ giao hàng
export const getShippingAddresses = async (): Promise<IShippingAddress[]> => {
    try {
        const response = await axios.get(`${API_URL}/auth/shipping-addresses`);
        console.log("response.data:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching shipping addresses:", error);
        throw error;
    }
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId: string) => {
    try {
        const response = await axios.put(`${API_URL}/auth/shipping-addresses/${addressId}/default`);
        return response.data;
    } catch (error) {
        console.error(`Error setting default address for ID ${addressId}:`, error);
        throw error;
    }
};

// Xóa địa chỉ giao hàng
export const deleteAddress = async (addressId: string) => {
    try {
        const response = await axios.delete(`${API_URL}/auth/shipping-addresses/${addressId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting address with ID ${addressId}:`, error);
        throw error;
    }
};
