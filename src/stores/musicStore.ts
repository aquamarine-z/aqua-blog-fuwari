import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { musicConfig } from "../config";

export interface Track {
	title: string;
	artist?: string;
	src: string;
	cover?: string;
}

export interface MusicState {
	playlist: Track[];
	currentTrackIndex: number;
	isPlaying: boolean;
	volume: number;
	currentTime: number;
	duration: number;
	togglePlay: () => void;
	setPlaying: (playing: boolean) => void;
	nextTrack: () => void;
	prevTrack: () => void;
	selectTrack: (index: number) => void;
	setVolume: (volume: number) => void;
	setCurrentTime: (time: number) => void;
	setDuration: (duration: number) => void;
}

export const musicStore = createStore<MusicState>()(
	persist(
		(set) => ({
			playlist: musicConfig.tracks || [],
			currentTrackIndex: 0,
			isPlaying: false, // Default to paused to comply with browser autoplay policies initially
			volume: 0.15, // Default volume
			currentTime: 0,
			duration: 0,
			togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
			setPlaying: (playing) => set({ isPlaying: playing }),
			nextTrack: () =>
				set((state) => {
					const nextIndex =
						(state.currentTrackIndex + 1) % state.playlist.length;
					return { currentTrackIndex: nextIndex, currentTime: 0 };
				}),
			prevTrack: () =>
				set((state) => {
					const prevIndex =
						(state.currentTrackIndex - 1 + state.playlist.length) %
						state.playlist.length;
					return { currentTrackIndex: prevIndex, currentTime: 0 };
				}),
			selectTrack: (index) =>
				set((state) => {
					if (index >= 0 && index < state.playlist.length) {
						return { currentTrackIndex: index, currentTime: 0 };
					}
					return {};
				}),
			setVolume: (volume) => set({ volume }),
			setCurrentTime: (currentTime) => set({ currentTime }),
			setDuration: (duration) => set({ duration }),
		}),
		{
			name: "music-storage", // name of the item in the storage
			// Persist only essential states to prevent high-frequency localStorage writes from currentTime updates
			partialize: (state) => ({
				isPlaying: state.isPlaying,
				currentTrackIndex: state.currentTrackIndex,
				volume: state.volume,
			}),
		},
	),
);
