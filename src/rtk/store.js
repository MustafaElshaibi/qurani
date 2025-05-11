import { configureStore } from "@reduxjs/toolkit";

import {quranApi} from "./Services/QuranApi";
import playerReducer from "./Reducers/PlayerReducer";
import authReducer from './Reducers/AuthReducer'
import librariesSlice from './Reducers/LibraryReducer';
import langSlice from './Reducers/langSlice';
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [quranApi.reducerPath]: quranApi.reducer,
    player: playerReducer,
    auth: authReducer,
    libraries: librariesSlice,
    lang: langSlice,
  }, 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['player/playTrack'],
        ignoredPaths: ['player.currentSurah.reciter', 'player.queue'],
        warnAfter: 50,
      },
      immutableCheck: {
        warnAfter: 50,
      },
    }).concat(quranApi.middleware),
})

// Throttled localStorage persistence
const persistStore = () => {
  const positions = store.getState().player.playbackPositions;
  localStorage.setItem('playbackPositions', JSON.stringify(positions));
};

store.subscribe(persistStore);
setupListeners(store.dispatch);