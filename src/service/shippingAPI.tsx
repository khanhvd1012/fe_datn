// src/service/shippingAPI.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getProvinces = async () => {
  try {
    const res = await axios.post(`${API_URL}/shipping/provinces`, {}, { headers: getAuthHeaders() });
    return res.data.data;
  } catch (error: any) {
    console.error("Lỗi getProvinces:", error);
    throw new Error(error.response?.data?.message || "Không lấy được danh sách tỉnh/thành");
  }
};

export const getDistricts = async (province_id: number) => {
  try {
    const res = await axios.post(
      `${API_URL}/shipping/districts`,
      { province_id },
      { headers: getAuthHeaders() }
    );
    return res.data.data;
  } catch (error: any) {
    console.error("Lỗi getDistricts:", error);
    throw new Error(error.response?.data?.message || "Không lấy được danh sách quận/huyện");
  }
};

export const getWards = async (district_id: number) => {
  try {
    const res = await axios.post(
      `${API_URL}/shipping/wards`,
      { district_id },
      { headers: getAuthHeaders() }
    );
    return res.data.data;
  } catch (error: any) {
    console.error("Lỗi getWards:", error);
    throw new Error(error.response?.data?.message || "Không lấy được danh sách phường/xã");
  }
};

export const getShippingFee = async (payload: {
  cart_id: string;
  toDistrictId: number;
  toWardCode: string;
}) => {
  try {
    const res = await axios.post(`${API_URL}/shipping/fee`, payload, { headers: getAuthHeaders() });
    return res.data;
  } catch (error: any) {
    console.error("Lỗi getShippingFee:", error);
    throw new Error(error.response?.data?.message || "Không tính được phí vận chuyển");
  }
};
