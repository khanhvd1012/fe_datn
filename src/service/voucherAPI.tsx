import axios from "axios";
import type { IVoucher } from "../interface/voucher";

const API_URL = import.meta.env.VITE_API_URL;

export const getVouchers = async () => {
    try {
        const response = await axios.get(`${API_URL}/vouchers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching vouchers:", error);
        throw error;
    }
};

export const getVoucherById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/vouchers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching voucher:", error);
        throw error;
    }
};

export const addVoucher = async (voucher: IVoucher) => {
    try {
        const response = await axios.post(`${API_URL}/vouchers`, voucher);
        return response.data;
    } catch (error) {
        console.error("Error creating voucher:", error);
        throw error;
    }
};

export const updateVoucher = async (
    id: string, 
    voucher: Partial<Omit<IVoucher, '_id' | 'createdAt' | 'updatedAt'>>
) => {
    try {
        const response = await axios.put(`${API_URL}/vouchers/${id}`, voucher);
        return response.data;
    } catch (error) {
        console.error("Error updating voucher:", error);
        throw error;
    }
};

export const deleteVoucher = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/vouchers/${id}`);
        return {
            message: "Voucher deleted successfully",
            status: 200
        };
    } catch (error) {
        console.error("Error deleting voucher:", error);
        throw error;
    }
};
