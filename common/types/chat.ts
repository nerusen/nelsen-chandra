export interface MessageProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  message: string;
  is_reply?: boolean;
  reply_to?: string;
  created_at: string;
  updated_at?: string;
  is_show?: boolean;
  is_pinned?: boolean;
  is_ai?: boolean;
  is_thinking?: boolean;
  user_email?: string;
}

export interface ChatListProps {
  messages: MessageProps[];
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
}
