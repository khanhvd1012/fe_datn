import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Users,
  Search,
  Send,
  MoreVertical,
  Edit3,
  Trash2,
  Phone,
  Video,
  AlertCircle,
  ArrowDown
} from 'lucide-react';
import { useAdminChat } from '../../hooks/useChat';
import type { ChatRoom, ChatMessage } from '../../interface/chat';
import '../../components/css/Chat_Page.css';

const ChatPage = () => {
  const {
    rooms,
    selectedRoom,
    messages,
    isLoading,
    error,
    form,
    fetchRooms,
    selectRoom,
    sendMessage
  } = useAdminChat();

  const [searchTerm, setSearchTerm] = useState('');
  const [showMessageActions, setShowMessageActions] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, watch } = form;
  const messageValue = watch('message');
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [shouldScrollOnRoomChange, setShouldScrollOnRoomChange] = useState(false);
  const [shouldScrollOnSend, setShouldScrollOnSend] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch rooms ban đầu
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Theo dõi scroll để hiển thị nút cuộn xuống
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollBtn(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedRoom]);

  // Khi có tin nhắn mới từ phòng khác → tăng unread count
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    // Chỉ tăng unread count khi tin nhắn từ phòng khác và từ user
    if (lastMsg.chatRoom_id !== selectedRoom?._id && lastMsg.sender_id.role === 'user') {
      setUnreadCounts(prev => ({
        ...prev,
        [lastMsg.chatRoom_id]: (prev[lastMsg.chatRoom_id] || 0) + 1
      }));
    }
  }, [messages, selectedRoom]);

  // Khi chọn phòng mới → cuộn xuống (chỉ khi user thực sự chọn phòng)
  useEffect(() => {
    if (selectedRoom && shouldScrollOnRoomChange) {
      // Đợi một chút để DOM được render hoàn toàn
      setTimeout(() => {
        scrollToBottom();
        setShouldScrollOnRoomChange(false);
      }, 100);
    }
  }, [selectedRoom, shouldScrollOnRoomChange]);

  // Scroll khi messages load xong sau khi chọn phòng
  useEffect(() => {
    if (shouldScrollOnRoomChange && messages && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
        setShouldScrollOnRoomChange(false);
      }, 50);
    }
  }, [messages, shouldScrollOnRoomChange]);

  // Hàm cuộn xuống bottom với nhiều fallback
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Thử nhiều cách scroll
      requestAnimationFrame(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          console.log('Scroll executed'); // Debug log
        }
      });
    }
  };

  // Hàm xử lý click nút scroll down
  const handleScrollDown = () => {
    scrollToBottom();
    setShowScrollBtn(false);
  };

  // Khi admin chọn room → reset unreadCount và set flag để scroll
  const handleSelectRoom = (room: ChatRoom) => {
    selectRoom(room);
    setShouldScrollOnRoomChange(true); // Set flag để trigger scroll
    setUnreadCounts(prev => ({
      ...prev,
      [room._id]: 0
    }));
  };

  // Xử lý gửi tin nhắn
  // Xử lý gửi tin nhắn
  const handlee = async (data: { message: string }) => {
    if (!data.message.trim() && selectedFiles.length === 0) return;
    if (!selectedRoom) return;

    try {
      const formData = new FormData();

      // Nếu có text
      if (data.message.trim()) {
        formData.append("content", data.message.trim());
      }

      // Nếu có ảnh
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await sendMessage(formData); // gửi FormData thay vì gọi onSubmit()

      reset(); // reset input text
      setSelectedFiles([]); // clear ảnh đã chọn
      setShouldScrollOnSend(true);

      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        setShouldScrollOnSend(false);
      }, 800);
    } catch (error) {
      console.error("Error sending message:", error);
      setShouldScrollOnSend(false);
    }
  };


  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hôm nay';
    if (date.toDateString() === yesterday.toDateString()) return 'Hôm qua';
    return date.toLocaleDateString('vi-VN');
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    if (!messages || !Array.isArray(messages)) return groups;
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  const filteredRooms = rooms.filter(room =>
    room.participants.some(p =>
      p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="chat-page-container">
      <div className="chat-page-content">
        {/* Sidebar */}
        <div className="chat-page-sidebar">
          <div className="chat-page-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm phòng chat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="chat-page-search-input"
            />
          </div>

          <div className="chat-page-rooms">
            {isLoading ? (
              <div className="chat-page-loading">
                <div className="loading-spinner" />
                <span>Đang tải...</span>
              </div>
            ) : error ? (
              <div className="chat-page-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="chat-page-empty">
                <Users size={48} />
                <p>Không có phòng chat nào</p>
              </div>
            ) : (
              filteredRooms.map((room) => {
                const participant = room.participants[0] || { username: 'Unknown', email: '' };
                const lastMessage = room.lastMessage || { content: '', createdAt: '' };
                const unread = unreadCounts[room._id] || 0;

                return (
                  <div
                    key={room._id}
                    className={`chat-page-room-item ${selectedRoom?._id === room._id ? 'active' : ''}`}
                    onClick={() => handleSelectRoom(room)}
                  >
                    <div className="room-avatar">
                      <MessageCircle size={20} />
                    </div>
                    <div className="room-info">
                      <div className="room-name">{participant.username}</div>
                      <div className="room-email">{participant.email}</div>
                      {lastMessage.content && (
                        <div className="room-last-message">{lastMessage.content}</div>
                      )}
                    </div>
                    <div className="room-meta">
                      <div className="room-time">{lastMessage.createdAt && formatTime(lastMessage.createdAt)}</div>
                      {unread > 0 && <div className="room-unread">{unread}</div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat */}
        <div className="chat-page-main">
          {selectedRoom ? (
            <>
              <div className="chat-page-main-header">
                <div className="chat-user-info">
                  <div className="chat-user-avatar"><MessageCircle size={20} /></div>
                  <div className="chat-user-details">
                    <div className="chat-user-name">{selectedRoom.participants[0]?.username || 'Unknown'}</div>
                    <div className="chat-user-email">{selectedRoom.participants[0]?.email || ''}</div>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="chat-action-btn"><Phone size={16} /></button>
                  <button className="chat-action-btn"><Video size={16} /></button>
                  <button className="chat-action-btn"><MoreVertical size={16} /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-page-messages" ref={messagesContainerRef}>
                {Object.keys(groupedMessages).length === 0 ? (
                  <div className="chat-page-empty">
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
                          className={`message-item ${message.sender_id.role === 'user' ? 'user-message' : 'admin-message'}`}
                          onMouseEnter={() => setShowMessageActions(message._id)}
                          onMouseLeave={() => setShowMessageActions(null)}
                        >
                          <div className="message-content">
                            <div className="message-sender">
                              {message.sender_id.username} ({message.sender_id.role})
                            </div>
                            <div className="message-text">{message.content}</div>
                            {message.images && message.images.length > 0 && (
                              <div className="message-images">
                                {message.images.map((img, i) => (
                                  <img key={i} src={img} alt="chat-img" className="chat-message-img" style={{ width: 300 }} />
                                ))}
                              </div>
                            )}
                            <div className="message-meta">
                              <span className="message-time">{formatTime(message.createdAt)}</span>
                              {message.isEdited && <span className="message-edited">(đã chỉnh sửa)</span>}
                            </div>
                          </div>
                          {showMessageActions === message._id && message.sender_id.role !== 'user' && (
                            <div className="message-actions">
                              <button className="message-action-btn"><Edit3 size={14} /></button>
                              <button className="message-action-btn"><Trash2 size={14} /></button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Nút scroll xuống */}
              {showScrollBtn && (
                <button
                  className="scroll-down-btn"
                  onClick={handleScrollDown}
                  style={{
                    position: 'absolute',
                    bottom: '80px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#007bff';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <ArrowDown size={20} />
                </button>
              )}

              {/* Input */}
              <div className="chat-page-input-container">
                <form onSubmit={handleSubmit(handlee)} className="chat-page-form">
                  {/* Preview ảnh */}
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

                  <div className="chat-page-input-wrapper">
                    {/* Nút chọn ảnh */}
                    <label className="upload-btn">
                      📎
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={(e) => {
                          if (e.target.files) {
                            setIsUploading(true); // vừa chọn ảnh → disable nút gửi
                            const newFiles = Array.from(e.target.files);
                            setSelectedFiles(prev => [...prev, ...newFiles]);

                            // giả sử cần delay nhỏ để state update xong rồi mới cho gửi
                            setTimeout(() => {
                              setIsUploading(false);
                            }, 300); // 0.3s là đủ mượt
                          }
                        }}
                      />
                    </label>

                    <input
                      {...register('message')}
                      type="text"
                      placeholder="Nhập tin nhắn..."
                      className="chat-page-input"
                    />

                    <button
                      type="submit"
                      className="chat-page-send-btn"
                      disabled={isUploading || !messageValue?.trim()}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="chat-page-no-selection">
              <MessageCircle size={64} />
              <h3>Chọn một phòng chat</h3>
              <p>Chọn phòng chat từ danh sách bên trái để bắt đầu trò chuyện</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;