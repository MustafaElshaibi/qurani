// librariesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc as firestoreDoc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";

// System libraries configuration (always first)
const SYSTEM_LIBRARIES = [
  {
    id: "favorites",
    name: "Favorites",
    type: "system",
    createdAt: Date.now(),
    items: [],
  },
];

// Helper function for localStorage and Firestore persistence
const persistState = async (state) => {
  try {
    const toPersist = {
      activeLibraryId: state.activeLibraryId,
      userLibraries: state.libraries
        .filter((l) => l.type === "user")
        .map((l) => ({
          id: l.id,
          name: l.name,
          items: l.items,
          createdAt: l.createdAt,
        })),
      favoritesItems:
        state.libraries.find((l) => l.id === "favorites")?.items || [],
    };
    if (auth.currentUser?.uid) {
      const userDocRef = firestoreDoc(
        db,
        "users",
        String(auth.currentUser.uid)
      );
      setDoc(userDocRef, { libraries: toPersist }, { merge: true });
      // Optionally, you can await setDoc if you want to ensure it's done before proceeding
    }
    // Save to localStorage
    localStorage.setItem("libraries", JSON.stringify(toPersist));
  } catch (error) {
    console.error("Failed to persist state:", error);
  }
};

// Initial state loader
const loadInitialState = () => {
  try {
    // check if data is already in localStorage
    const localStorageData = localStorage.getItem("libraries");
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      const systemLibraries = SYSTEM_LIBRARIES.map((lib) => ({
        ...lib,
        items: parsedData.favoritesItems || [],
      }));
      const userLibrarie = (parsedData.userLibraries || []).map((lib) => ({
        ...lib,
        type: "user",
      }));

      return {
        libraries: [
          ...systemLibraries, // Favorites first
          ...userLibrarie, // User libraries after
        ],
        activeLibraryId: parsedData.activeLibraryId || "favorites",
      };
    }
  } catch (error) {
    console.error("Failed to load state:", error);
  }

  return {
    libraries: [...SYSTEM_LIBRARIES],
    activeLibraryId: "favorites",
  };
};

const librariesSlice = createSlice({
  name: "libraries",
  initialState: loadInitialState(),
  reducers: {
    // Toggle song in favorites (fixed implementation)
    toggleFavorite: (state, action) => {
      const favoritesLib = state.libraries.find((l) => l.id === "favorites");
      if (!favoritesLib) return;

      const songIndex = favoritesLib.items.findIndex(
        (s) => s.id === action.payload.id
      );
      if (songIndex === -1) {
        favoritesLib.items.push(action.payload);
      } else {
        favoritesLib.items.splice(songIndex, 1);
      }
      persistState(state);
    },

    // Create new library (insert after system libraries)
    createLibrary: {
      reducer: (state, action) => {
        // Find first user library index (after system libraries)
        const insertIndex = state.libraries.findIndex((l) => l.type === "user");
        if (insertIndex === -1) {
          state.libraries.push(action.payload);
        } else {
          state.libraries.splice(insertIndex, 0, action.payload);
        }
        state.activeLibraryId = action.payload.id;
        persistState(state);
      },
      prepare: (name) => ({
        payload: {
          id: `lib-${Date.now()}`,
          name: name.trim(),
          items: [],
          type: "user",
          createdAt: Date.now(),
        },
      }),
    },

    // Update library name
    renameLibrary: (state, action) => {
      const { libraryId, newName } = action.payload;
      const library = state.libraries.find((l) => l.id === libraryId);
      if (library?.type === "user" && newName.trim()) {
        library.name = newName.trim();
        persistState(state);
      }
    },

    // Delete library (enhanced system protection)
    deleteLibrary: (state, action) => {
      const libraryId = action.payload;
      if (
        state.libraries.some((l) => l.id === libraryId && l.type === "system")
      )
        return;

      state.libraries = state.libraries.filter((l) => l.id !== libraryId);
      if (state.activeLibraryId === libraryId) {
        state.activeLibraryId = "favorites";
      }
      persistState(state);
    },

    // Set active library (with system fallback)
    setActiveLibrary: (state, action) => {
      const isValid = state.libraries.some((l) => l.id === action.payload);
      state.activeLibraryId = isValid ? action.payload : "favorites";
      persistState(state);
    },

    // Reorder libraries (user libraries only)
    reorderLibraries: (state, action) => {
      const systemLibs = state.libraries.filter((l) => l.type === "system");
      const userLibs = state.libraries.filter((l) => l.type === "user");

      const [removed] = userLibs.splice(action.payload.startIndex, 1);
      userLibs.splice(action.payload.endIndex, 0, removed);

      state.libraries = [...systemLibs, ...userLibs];
      persistState(state);
    },

    // Add song to specific library
    addToLibrary: (state, action) => {
      const { libraryId, song } = action.payload;
      const library = state.libraries.find((l) => l.id === libraryId);
      if (library && !library.items.some((s) => s.id === song.id)) {
        library.items.push(song);
        persistState(state);
      }
    },

    // Remove song from library
    removeFromLibrary: (state, action) => {
      const { libraryId, songId } = action.payload;
      const library = state.libraries.find((l) => l.id === libraryId);
      if (library) {
        library.items = library.items.filter((s) => s.id !== songId);
        persistState(state);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadLibrariesFromFirestore.fulfilled, (state, action) => {
      state.libraries = action.payload.libraries;
      state.activeLibraryId = action.payload.activeLibraryId;
    });
  },
});

// Thunk to load libraries from Firestore
export const loadLibrariesFromFirestore = createAsyncThunk(
  "libraries/loadFromFirestore",
  async (uid, { dispatch }) => {
    // If not, fetch from Firestore
    if (auth.currentUser?.uid !== uid) return;
    const userDocRef = firestoreDoc(db, "users", String(uid));
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userLibrariesData = userData.libraries || {};
      console.log(userLibrariesData);
      const systemLibraries = SYSTEM_LIBRARIES.map((lib) => ({
        ...lib,
        items: userLibrariesData.favoritesItems || [],
      }));
      const userLibrarie = (userLibrariesData.userLibraries || []).map(
        (lib) => ({
          ...lib,
          type: "user",
        })
      );
      return {
        libraries: [...systemLibraries, ...userLibrarie],
        activeLibraryId: userLibrariesData.activeLibraryId || "favorites",
      };
    }
    return {
      libraries: [...SYSTEM_LIBRARIES],
      activeLibraryId: "favorites",
    };
  }
);

// Selectors
export const selectAllLibraries = (state) => state.libraries.libraries;
export const selectActiveLibrary = (state) =>
  state.libraries.libraries.find(
    (l) => l.id === state.libraries.activeLibraryId
  ) || state.libraries.libraries[0]; // Fallback to favorites

export const selectIsFavorite = (state, songId) => {
  const favorites = state.libraries.libraries.find((l) => l.id === "favorites");
  return favorites?.items.some((s) => s.id === songId) || false;
};
export const selectIsInPlayList = (state, libId, songId) => {
  const favorites = state.libraries.libraries.find((l) => l.id === libId);
  return favorites?.items.some((s) => s.id === songId) || false;
};

export const selectActiveLibraryItems = (state) =>
  selectActiveLibrary(state)?.items || [];

export const {
  toggleFavorite,
  createLibrary,
  renameLibrary,
  deleteLibrary,
  setActiveLibrary,
  reorderLibraries,
  addToLibrary,
  removeFromLibrary,
} = librariesSlice.actions;

export default librariesSlice.reducer;
