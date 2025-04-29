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
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(quranApi.middleware)
})

// Subscribe to store updates
store.subscribe(() => {
  const positions = store.getState().player.playbackPositions;
  localStorage.setItem('playbackPositions', JSON.stringify(positions));
});

setupListeners(store.dispatch);