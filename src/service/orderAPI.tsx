import axios from "axios";
import type { IOrder } from "../interface/order";

const API_URL = import.meta.env.VITE_API_URL;

// Hàm tiện ích lấy headers có token
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ✅ Admin: lấy tất cả đơn hàng
export const getAllOrders = async (): Promise<IOrder[]> => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data || [];
};

// ✅ User: lấy đơn hàng của mình
export const getUserOrders = async (): Promise<IOrder[]> => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/orders/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data || [];
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    throw error;
  }
};




// 🟩 Lấy đơn hàng theo ID
export const getOrderById = async (id: string): Promise<IOrder> => {
  const res = await axios.get(`${API_URL}/orders/${id}`, {
    headers: authHeader(),
  });
  return res.data?.data;
};

// 🟩 Tạo đơn hàng mới
export const createOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
  const res = await axios.post(`${API_URL}/orders`, orderData, {
    headers: authHeader(),
  });
  return res.data?.data;
};

// 🟩 Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (
  id: string,
  status: IOrder["status"]
): Promise<IOrder> => {
  const res = await axios.put(
    `${API_URL}/orders/${id}`,
    { status },
    { headers: authHeader() }
  );
  return res.data?.data;
};

// 🟩 Hủy đơn hàng
export const cancelOrder = async (
  id: string,
  cancel_reason: string
): Promise<IOrder> => {
  const res = await axios.put(
    `${API_URL}/orders/${id}/cancel`,
    { cancel_reason },
    { headers: authHeader() }
  );
  return res.data?.data;
};
