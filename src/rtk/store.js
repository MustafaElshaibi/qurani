import { configureStore } from "@reduxjs/toolkit";

import {quranApi} from "./Services/QuranApi";
import playerReducer from "./Reducers/PlayerReducer";
import authReducer from './Reducers/AuthReducer'
import librariesSlice from './Reducers/LibraryReducer';
import langSlice from './Reducers/langSlice';
import { setupListeners } from "@reduxjs/toolkit/query";
import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";

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
        ignoredActions: ['player/playTrack', 'auth/setUser'],
        ignoredPaths: ['player.currentSurah.reciter', 'player.queue'],
        warnAfter: 50,
      },
      immutableCheck: {
        warnAfter: 50,
      },
    }).concat(quranApi.middleware),
})

let prevUser = null;
let prevPlaybackPositions = null;
let prevLang = null;

const persistStore = () => {
  const state = store.getState();
  const currentUser = state.auth.user;
  const currentPlaybackPositions = state.player.playbackPositions;
  const currentLang = state.lang;
  // Check if any relevant state has changed
  const userChanged = currentUser !== prevUser;
  const positionsChanged = currentPlaybackPositions !== prevPlaybackPositions;
  const langChanged = currentLang !== prevLang;
  // Skip if no relevant changes
  if (!userChanged && !positionsChanged && !langChanged) {
    return;
  }
  console.log("one")

  // Save playback positions to localStorage
  localStorage.setItem('playbackPositions', JSON.stringify(currentPlaybackPositions));

  // Save to Firestore if user is logged in
  if (currentUser?.uid) {
    const userDocRef = doc(db, "users", String(currentUser.uid));
    setDoc(
      userDocRef,
      {
        user: {
          uid: currentUser.uid,
          displayName: currentUser.displayName || "",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "",
        },
        playbackPositions: currentPlaybackPositions,
        lang: currentLang,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch((err) => {
      console.error("Failed to save user data to Firestore:", err);
    });
  }

  // Update previous values to current
  prevUser = currentUser;
  prevPlaybackPositions = currentPlaybackPositions;
  prevLang = currentLang;
};


store.subscribe(persistStore);
setupListeners(store.dispatch);