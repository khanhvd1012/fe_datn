export interface ChatMessage {
  _id: string;
  chatRoom_id: string;
  sender_id: {
    _id: string;
    username: string;
    role: 'user' | 'employee' | 'admin';
  };
  receiver_id?: string | null;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  isEdited?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoom {
  _id: string;
  participants: Array<{
    _id: string;
    username: string;
    email: string;
  }>;
  lastMessage?: {
    _id: string;
    content: string;
    createdAt: string;
  };
  isEmployeeJoined: boolean;
  lastEmployeeMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  content: string;
  messageType?: 'text';
}

export interface ChatFormData {
  message: string;
}