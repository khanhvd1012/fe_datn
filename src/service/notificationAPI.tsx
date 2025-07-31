import axios from "axios";
import type { INotification } from "../interface/notification";

const API_URL = import.meta.env.VITE_API_URL;
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Lấy tất cả thông báo
export const getNotifications = async (): Promise<INotification[]> => {
  try {
    const res = await axios.get(`${API_URL}/notifications`, {
      headers: getAuthHeader(),
    });
    return res.data.data;
  } catch (error) {
    console.error("Lỗi API:", error);
    throw error;
  }
};

// Lấy thông báo tồn kho thấp (admin/employee)
export const getLowStockNotifications = async (): Promise<INotification[]> => {
  try {
    const res = await axios.get(`${API_URL}/notifications/low-stock`, {
      headers: getAuthHeader()
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching low stock notifications:", error);
    throw error;
  }
};

// Đánh dấu đã đọc 1 thông báo
export const markNotificationAsRead = async (id: string): Promise<INotification> => {
  try {
    const res = await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Đánh dấu tất cả là đã đọc
export const markAllNotificationsAsRead = async (): Promise<{ message: string }> => {
  try {
    const res = await axios.put(`${API_URL}/notifications/read-all`, {}, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Xóa 1 thông báo
export const deleteNotification = async (id: string): Promise<INotification> => {
  try {
    const res = await axios.delete(`${API_URL}/notifications/${id}`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Xóa tất cả thông báo đã đọc
export const deleteAllReadNotifications = async (): Promise<{ message: string }> => {
  try {
    const res = await axios.delete(`${API_URL}/notifications/read/all`, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting read notifications:", error);
    throw error;
  }
};
