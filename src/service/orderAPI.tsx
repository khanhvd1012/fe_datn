import axios from "axios";
import type { IOrder } from "../interface/order";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy tất cả đơn hàng
export const getOrders = async (): Promise<IOrder[]> => {
  try {
    const res = await axios.get(`${API_URL}/orders`);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw err;
  }
};

// Lấy đơn hàng theo ID
export const getOrderById = async (id: string): Promise<IOrder> => {
  try {
    const res = await axios.get(`${API_URL}/orders/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching order by ID:", err);
    throw err;
  }
};

// Tạo đơn hàng mới
export const createOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
  try {
    const res = await axios.post(`${API_URL}/orders`, orderData);
    return res.data.data;
  } catch (err) {
    console.error("Error creating order:", err);
    throw err;
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (
  id: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled'
): Promise<IOrder> => {
  try {
    const res = await axios.put(`${API_URL}/orders/${id}`, { status });
    return res.data.data;
  } catch (err) {
    console.error("Error updating order status:", err);
    throw err;
  }
};

// Hủy đơn hàng
export const cancelOrder = async (id: string, cancel_reason: string): Promise<IOrder> => {
  try {
    const res = await axios.put(`${API_URL}/orders/${id}/cancel`, { cancel_reason });
    return res.data.data;
  } catch (err) {
    console.error("Error canceling order:", err);
    throw err;
  }
};
