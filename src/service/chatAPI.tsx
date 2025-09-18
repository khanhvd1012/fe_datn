import axios from 'axios';
import type { ChatMessage, ChatRoom, SendMessageRequest } from '../interface/chat';

const API_URL = import.meta.env.VITE_API_URL;

const createAxiosInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: `${API_URL}/chats`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// Thêm simple cache mechanism
const cache = {
  data: null as any,
  timestamp: 0,
  CACHE_DURATION: 0, // 1.5 seconds cache
};

export const chatAPI = {
  // User APIs
  getUserHistory: async () => {
    const now = Date.now();
    if (cache.data && (now - cache.timestamp < cache.CACHE_DURATION)) {
      return cache.data; // Return cached data if within duration
    }

    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get('/user/history');
    
    // Update cache
    cache.data = response.data;
    cache.timestamp = now;
    
    return response.data; // Trả về toàn bộ response.data
  },

  sendMessage: async (data: SendMessageRequest) => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.post('/user/send', data);
    return response.data; // Trả về toàn bộ response.data
  },

  // Admin APIs
  getAdminRooms: async () => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get('/admin/rooms');
    return response.data.chatRooms;
  },

  getOneMessageUser: async (chatRoomId: string) => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`/admin/rooms/${chatRoomId}`);
    return response.data;
  },

  sendAdminMessage: async (chatRoomId: string, data: SendMessageRequest) => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.post(`/admin/send/${chatRoomId}`, data);
    return response.data.newMessage;
  },

  editMessage: async (messageId: string, content: string) => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.put('/admin/message', { messageId, content });
    return response.data.updatedMessage;
  }
};

// --- Thêm cooldown cho API nhận tin nhắn ---
let lastReceiveTime = 0;
const RECEIVE_COOLDOWN_MS = 1500; // 1.5 giây

export const chatAPIWithCooldown = {
  ...chatAPI, // copy toàn bộ API

  getUserHistory: async () => {
    const now = Date.now();
    if (now - lastReceiveTime < RECEIVE_COOLDOWN_MS) {
      console.warn('Chờ 3 giây mới được reset API nhận tin nhắn');
      return null; // hoặc cache nếu muốn
    }
    lastReceiveTime = now;
    return chatAPI.getUserHistory();
  }
};

export default chatAPIWithCooldown; // export bản cooldown nếu muốn frontend dùng
