import { HttpService } from '@/services';
import { create } from 'zustand';

export const useBrainStore = create((set, get) => ({
  chats: [],
  prompts: [],
  promptLoading: false,
  chatKey: '',
  audioSpeed: 1,
  userData: {},

  loadChats: (data: any[]) => set(() => ({ chats: data })),
  loadPrompts: (data: any[]) => set(() => ({ prompts: data })),
  addPrompt: (data: any) => set((state: any) => ({ prompts: [...state.prompts, data] })),

  updateUserData: (data: any) => set(() => ({ userData: data })),

  setPromptLoading: (value: boolean) =>
    set((state: any) => {
      if (value) {
        const { prompts }: any = get();
        const http = new HttpService();
        http
          .push('/prompt/result_chat/', { id: prompts.slice(-1)[0].id })
          .then((res_ai: any) => {
            state.addPrompt(res_ai);
          })
          .catch(() => {})
          .finally(() => {
            state.setPromptLoading(false);
          });
      }
      return { promptLoading: value };
    }),

  setChatKey: (key: string) => set(() => ({ chatKey: key })),

  setAudioSpeed: (value: number) =>
    set(() => ({
      audioSpeed: value
    })),

  dislikePrompt: (id: number) =>
    set(() => {
      const { prompts }: any = get();
      return {
        prompts: prompts.map((prompt: any) => (prompt.id === id ? { ...prompt, dislike: true } : prompt))
      };
    }),

  toggleBookmark: (id: number) =>
    set(() => {
      const { chats }: any = get();
      return {
        chats: chats.map((chat: any) => (chat.id === id ? { ...chat, bookmark: !chat.bookmark } : chat))
      };
    }),

  dropChat: (id: number) =>
    set(() => {
      const { chats }: any = get();
      return {
        chats: chats.filter((chat: any) => chat.id !== id)
      };
    })
}));
