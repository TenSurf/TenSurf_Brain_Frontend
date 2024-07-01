import { HttpService } from '@/services';
import { create } from 'zustand';

export const useBrainStore = create((set, get) => ({
  chats: [],
  prompts: [],
  promptLoading: false,
  chatKey: '',
  audioSpeed: 1,
  userData: {},
  firstPrompt: 0,

  loadChats: (data: any[]) => set(() => ({ chats: data })),
  loadPrompts: (data: any[]) => set(() => ({ prompts: data })),
  addPrompt: (data: any, user: boolean) =>
    set((state: any) => {
      if (user) {
        return { prompts: [...state.prompts, data] };
      } else {
        return {
          prompts: state.prompts.map((prompt: any) =>
            prompt.id === data.parent_prompt
              ? { ...prompt, regenerations: [...prompt.regenerations, data], loading: false }
              : prompt
          ),
          promptLoading: false
        };
      }
    }),
  updateUserData: (data: any) => set(() => ({ userData: data })),

  setFirstPrompt: (id: number | null) =>
    set(() => ({
      firstPrompt: id
    })),

  getResultAi: (id: number) =>
    set((state: any) => {
      const http = new HttpService();

      http.push('/prompt/result_chat/', { id: id }).then((res_ai: any) => {
        state.addPrompt(res_ai, false);
        state.setFirstPrompt(null);
      });
      // .catch(() => {})
      // .finally(() => {
      // });
      return {
        prompts: state.prompts.map((prompt: any) => (prompt.id === id ? { ...prompt, loading: true } : prompt)),
        promptLoading: true
      };
    }),

  setChatKey: (key: string) => set(() => ({ chatKey: key })),

  setAudioSpeed: (value: number) =>
    set(() => ({
      audioSpeed: value
    })),

  likePrompt: (id: number, flag: boolean) =>
    set(() => {
      const { prompts }: any = get();
      return {
        prompts: prompts.map((prompt: any) => ({
          ...prompt,
          regenerations: prompt.regenerations.map((reg: any) => (reg.id === id ? { ...reg, like: flag } : reg))
        }))
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
