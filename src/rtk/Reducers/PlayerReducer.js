
import { createSlice } from '@reduxjs/toolkit';
import audioService from '../../services/audioService';

const loadPositions = () => {
  try {
    return JSON.parse(localStorage.getItem('playbackPositions')) || {};
  } catch {
    return {};
  }
};

const initialState = {
  currentSurah: null,
  playbackPositions: loadPositions(),
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  queue: [],
  originalQueue: [],
  history: [],
  repeat: 'none',
  shuffle: false,
  context: null,
};

const shuffleQueue = (array, currentSurah) => {
  if (!array?.length || !currentSurah) return array;
  
  const remaining = array.filter(t => t.id !== currentSurah.id);
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }
  return [currentSurah, ...remaining];
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playTrack: (state, action) => {
      const { surah, queue, context } = action.payload;
      state.currentSurah = surah;
      state.originalQueue = queue;
      state.queue = state.shuffle ? shuffleQueue([...queue], surah) : [...queue];
      state.context = context;
      state.history = [];
      state.isPlaying = true;
    },
    setPlaybackPositions: (state, action) => {
      state.playbackPositions[action.payload.surahId] = action.payload.position;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    nextTrack: (state) => {
      if (state.queue.length === 0) {
        state.isPlaying = false;
        return;
      }

      const currentIndex = state.queue.findIndex(
        t => t.id === state.currentSurah?.id
      );

      if (state.repeat === 'surah') {
        state.isPlaying = false;
        state.currentTime = 0;
        return;
      };

      let nextIndex = currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeat === 'playlist') nextIndex = 0;
        else {
          state.isPlaying = false;
          return;
        }
      }

      state.history.push(state.currentSurah);
      state.currentSurah = state.queue[nextIndex];
    },
    previousTrack: (state) => {
      if (state.currentTime > 3) {
        state.currentTime = 0;
        audioService.seekTo(0);
        return;
      }

      if (state.history.length > 0) {
        const previousTrack = state.history.pop();
        state.queue = [state.currentSurah, ...state.queue];
        state.currentSurah = previousTrack;
      } else if (state.queue.length > 0) {
        state.currentSurah = state.queue[0];
      }
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
      state.queue = state.shuffle 
        ? shuffleQueue([...state.originalQueue], state.currentSurah)
        : [...state.originalQueue];
    },
    setRepeat: (state) => {
      state.repeat = ['none', 'playlist', 'surah'][
        (['none', 'playlist', 'surah'].indexOf(state.repeat) + 1) % 3
      ];
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
      if (!state.shuffle) state.originalQueue.push(action.payload);
    },
  },
});

export const { 
  playTrack,
  togglePlayPause,
  nextTrack,
  previousTrack,
  toggleShuffle,
  setRepeat,
  setCurrentTime,
  setDuration,
  setVolume,
  setPlaybackPositions,
  addToQueue
} = playerSlice.actions;

export default playerSlice.reducer;