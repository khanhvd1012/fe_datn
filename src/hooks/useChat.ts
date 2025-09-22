import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { chatAPI } from '../service/chatAPI';
import type { ChatMessage, ChatRoom, ChatFormData } from '../interface/chat';

export type SendMessagePayload = ChatFormData | FormData;

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [aiActive, setAiActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastPollTime = useRef<number>(0);
  const POLL_INTERVAL = 3000; // 3 seconds
  const POLL_COOLDOWN = 1500; // 1.5 seconds cooldown

  const form = useForm<ChatFormData>({
    defaultValues: {
      message: '',
    },
  });

  // Polling function để kiểm tra tin nhắn mới
  const pollMessages = useCallback(async () => {
    const now = Date.now();
    if (now - lastPollTime.current < POLL_COOLDOWN) {
      return; // Skip if within cooldown
    }

    try {
      const data = await chatAPI.getUserHistory();
      if (data?.chatHistory) {
        setMessages(data.chatHistory);
        setChatRoom(data.chatRoom || null);
        setAiActive(data.aiActive || false);
        lastPollTime.current = now;
      }
    } catch (err: any) {
      console.error('Polling error:', err);
    }
  }, []);

  // Khởi tạo polling khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập để sử dụng chat');
      return;
    }

    // Initial fetch
    pollMessages();

    // Set up polling với interval dài hơn
    const interval = setInterval(pollMessages, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [pollMessages]);

  // Thêm xử lý error message từ API
  const handleError = (err: any) => {
    const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra';
    setError(errorMessage);
  };

  // Sửa lại hàm fetchMessages để xử lý response mới
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await chatAPI.getUserHistory();
      setMessages(data.chatHistory || []);
      setChatRoom(data.chatRoom || null);
      setAiActive(data.aiActive || false);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useChat.ts
  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    try {
      setError(null);

      let formData: FormData;
      if (payload instanceof FormData) {
        // Nếu đã truyền vào FormData (text + ảnh) thì dùng luôn
        formData = payload;
      } else {
        // Nếu chỉ có text thì tự tạo FormData
        formData = new FormData();
        if (payload.message.trim()) {
          formData.append("content", payload.message.trim());
        }
      }

      const response = await chatAPI.sendMessage(formData);

      setMessages(response.chatHistory || []);
      setChatRoom(response.chatRoom || null);
      setAiActive(response.aiActive || false);

      form.reset();
      return response;
    } catch (err: any) {
      handleError(err);
    }
  }, [form]);

  // Submit form
  const onSubmit = form.handleSubmit(sendMessage);

  return {
    messages,
    chatRoom,
    aiActive,
    isLoading,
    error,
    form,
    onSubmit,
    fetchMessages,
    sendMessage,
  };
};

export const useAdminChat = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastPollTime = useRef<number>(0);
  const POLL_INTERVAL = 3000;
  const POLL_COOLDOWN = 1500;

  const form = useForm<ChatFormData>({
    defaultValues: {
      message: '',
    },
  });

  // Polling function cho admin
  const pollRoomMessages = useCallback(async () => {
    const now = Date.now();
    if (now - lastPollTime.current < POLL_COOLDOWN) {
      return; // Skip if within cooldown
    }

    if (selectedRoom?._id) {
      try {
        const data = await chatAPI.getOneMessageUser(selectedRoom._id);
        if (data?.chatHistory) {
          setMessages(data.chatHistory);
          setSelectedRoom(prev => data.chatRoom || prev);
          lastPollTime.current = now;
        }
      } catch (err: any) {
        console.error('Polling error:', err);
      }
    }
  }, [selectedRoom]);

  // Khởi tạo polling khi chọn phòng
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !selectedRoom) return;

    // Initial fetch
    pollRoomMessages();

    // Set up polling với interval dài hơn
    const interval = setInterval(pollRoomMessages, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedRoom, pollRoomMessages]);

  // Lấy danh sách phòng chat
  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await chatAPI.getAdminRooms();
      setRooms(data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách phòng chat');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lấy tin nhắn của phòng được chọn
  const fetchRoomMessages = useCallback(async (chatRoomId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await chatAPI.getOneMessageUser(chatRoomId);
      setMessages(data.chatHistory || []);
      setSelectedRoom(data.chatRoom || null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải tin nhắn');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Chọn phòng chat
  const selectRoom = useCallback((room: ChatRoom) => {
    setSelectedRoom(room);
    if (room._id) {
      fetchRoomMessages(room._id);
    }
  }, [fetchRoomMessages]);

  // Gửi tin nhắn từ admin
  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    if (!selectedRoom) {
      setError('Vui lòng chọn phòng chat');
      return;
    }

    try {
      setError(null);

      let formData: FormData;
      if (payload instanceof FormData) {
        formData = payload;
      } else {
        formData = new FormData();
        if (payload.message.trim()) {
          formData.append("content", payload.message.trim());
        }
      }

      await chatAPI.sendAdminMessage(selectedRoom._id, formData);

      // Refresh messages sau khi gửi
      await pollRoomMessages();
      form.reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi gửi tin nhắn');
    }
  }, [selectedRoom, form, pollRoomMessages]);

  // Submit form
  const onSubmit = form.handleSubmit(sendMessage);

  return {
    rooms,
    selectedRoom,
    messages,
    isLoading,
    error,
    form,
    onSubmit,
    fetchRooms,
    selectRoom,
    sendMessage,
  };
};