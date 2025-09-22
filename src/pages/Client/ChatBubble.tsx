import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Smile,
  Minimize2,
  Maximize2,
  ArrowDown
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import type { ChatMessage, ChatFormData } from '../../interface/chat';
import '../../components/css/ChatBubble.css';

interface ChatBubbleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ isOpen, onToggle }) => {
  const { messages, chatRoom, isLoading, error, form, sendMessage } = useChat();
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, watch } = form;
  const messageValue = watch('message');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Theo dõi sự kiện cuộn để hiển thị nút mũi tên
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      // Hiển thị nút khi khoảng cách từ bottom > 200px
      setShowScrollBtn(distanceFromBottom > 200);
    };

    // Kiểm tra ngay khi component mount
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Đồng bộ localMessages với server
  useEffect(() => {
    if (messages && messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  // Auto scroll khi mở chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [isOpen]);

  // Auto scroll khi có tin nhắn admin/employee từ API
  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.sender_id?.role === 'admin' || lastMsg?.sender_id?.role === 'employee') {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          setShowScrollBtn(false);
        }, 500);
      }
    }
  }, [messages]);

  // Sửa lại hàm handleScrollToBottom để cập nhật state
  const handleScrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
      // Cập nhật state sau khi scroll
      setTimeout(() => setShowScrollBtn(false), 100);
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = async (data: ChatFormData) => {
    if (!data.message.trim() && selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("content", data.message.trim());
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Thêm tin nhắn tạm (local)
    const tempMessage: ChatMessage = {
      _id: `temp-${Date.now()}`,
      chatRoom_id: chatRoom._id,
      sender_id: {
        _id: 'current-user',
        username: 'Bạn',
        role: 'user',
      },
      content: data.message.trim(),
      images: selectedFiles.map(file => URL.createObjectURL(file)),
      type: selectedFiles.length > 0 ? 'image' : 'text',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemp: true,
    };
    setLocalMessages(prev => [...prev, tempMessage]);

    reset();
    setSelectedFiles([]);

    try {
      // chỉ gọi 1 lần để lấy kết quả từ server
      const response = await sendMessage(formData);

      if (response && response.data) {
        setLocalMessages(prev => {
          // Xoá tin nhắn tạm trước đó
          const updatedMessages = prev.filter(msg => !msg.isTemp);

          // Chuẩn hoá tin nhắn từ server
          const fixedMessages = response.data.map((msg: ChatMessage) => ({
            ...msg,
            sender_id: {
              ...msg.sender_id,
              role: msg.sender_id?.role || 'user',
            },
          }));

          return [...updatedMessages, ...fixedMessages];
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Format time & date
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(localMessages);

  if (!isOpen) {
    return (
      <div className="chat-bubble-closed" onClick={onToggle}>
        <MessageCircle size={24} />
        {messages.length > 0 && (
          <span className="chat-notification-badge">{messages.length}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`chat-bubble-container ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            <MessageCircle size={20} />
          </div>
          <div className="chat-title"><h4>Hỗ trợ khách hàng</h4></div>
        </div>
        <div className="chat-actions">
          <button className="chat-action-btn" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button className="chat-action-btn" onClick={onToggle}>
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="chat-messages" ref={chatContainerRef}>
            {showScrollBtn && (
              <button
                className="scroll-to-bottom-btn"
                onClick={handleScrollToBottom}
                title="Cuộn xuống dưới"
                style={{ opacity: showScrollBtn ? 1 : 0 }}
              >
                <ArrowDown size={20} />
              </button>
            )}

            {isLoading ? (
              <div className="chat-loading"><div className="loading-spinner" /><span>Đang tải tin nhắn...</span></div>
            ) : error ? (
              <div className="chat-error"><span>{error}</span></div>
            ) : Object.keys(groupedMessages).length === 0 ? (
              <div className="chat-empty">
                <MessageCircle size={48} />
                <p>Chưa có tin nhắn nào</p>
                <span>Hãy bắt đầu cuộc trò chuyện!</span>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="message-group">
                  <div className="message-date-divider"><span>{date}</span></div>
                  {dateMessages.map((message) => (
                    <div
                      key={message._id}
                      className={`message-item ${message.sender_id.role === 'user' ? 'message-right' : 'message-left'}`}
                    >
                      <div className="message-content">
                        {message.images && message.images.length > 0 ? (
                          <div className="message-images">
                            {message.images.map((img, i) => (
                              <img key={i} src={img} alt="chat-img" className="chat-image" />
                            ))}
                          </div>
                        ) : (
                          <div className="message-text">{message.content}</div>
                        )}
                        <div className="message-meta">
                          <span className="message-sender">{message.sender_id.username}</span>
                          <span className="message-time">{formatTime(message.createdAt)}</span>
                          {message.isEdited && <span className="message-edited">(đã chỉnh sửa)</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="chat-input-container">
            {selectedFiles.length > 0 && (
              <div className="chat-preview-images">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="chat-preview-item">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="chat-preview-img"
                    />
                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={() =>
                        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit(handleSendMessage)} className="chat-form">
              <div className="chat-input-wrapper">
                <label className="chat-input-btn">
                  <Paperclip size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => handleFileChange(e)}
                  />
                </label>
                <input
                  {...register('message', { required: 'Vui lòng nhập tin nhắn' })}
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="chat-input"
                  disabled={!!error && error.includes('Gửi quá nhanh')}
                />
                <button type="button" className="chat-input-btn"><Smile size={20} /></button>
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={Boolean(!messageValue?.trim() || (error && error.includes('Gửi quá nhanh')))}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
            {error && <div className="chat-error-message"><span>{error}</span></div>}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBubble;
