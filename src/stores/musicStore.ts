import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';

export interface MusicState {
  isPlaying: boolean;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
}

export const musicStore = createStore<MusicState>()(
  persist(
    (set) => ({
      isPlaying: true, // Default to playing
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setPlaying: (playing) => set({ isPlaying: playing }),
    }),
    {
      name: 'music-storage', // name of the item in the storage
    }
  )
);
