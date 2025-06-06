export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  linkedInConnected: boolean;
  openAIConnected: boolean;
}

export interface Post {
  id: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: string;
  publishedDate?: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  userId: string;
}

export interface Message {
  id: string;
  recipientName: string;
  recipientId: string;
  content: string;
  status: 'draft' | 'sent';
  sentDate?: string;
  type: 'connection' | 'prospecting' | 'followup';
  userId: string;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  type: 'post' | 'connection' | 'prospecting' | 'followup';
  userId: string;
}

export interface PromptType {
  id: string;
  name: string;
  description: string;
  promptText: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}