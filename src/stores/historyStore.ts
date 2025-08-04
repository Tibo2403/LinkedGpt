import { create } from 'zustand';
import { Post } from '../types';

interface HistoryState {
  posts: Post[];
  addPost: (post: Post) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));
