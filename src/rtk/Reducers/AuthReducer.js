import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  appleProvider,
  auth,
  facebookProvider,
  googleProvider,
  signInWithProvider,
} from "../../services/firebase";
import Cookies from "universal-cookie";
const initialState = {
  user: null,
  loading: false,
  error: null,
};

const cookie = new Cookies();

// Fixed parameter structure for email/password thunks
export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userData = await signInWithEmailAndPassword(auth, email, password);
      return userData.user;
    } catch (error) {
      let errorMessage = "Login failed";
      switch (error.code) {
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        default:
          errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerWithEmail = createAsyncThunk(
  "auth/registerWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userData = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userData.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const signWithGoogle = createAsyncThunk(
  "auth/signWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await signInWithProvider(googleProvider);
      const token = await userData.getIdToken();

      cookie.set("auth-token", token);


      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signWithFacebook = createAsyncThunk(
  "auth/signWithFacebook",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await signInWithProvider(facebookProvider);
      const token = await userData.getIdToken();

      cookie.set("auth-token", token);
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signWithApple = createAsyncThunk(
  "auth/signWithApple",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await signInWithProvider(appleProvider);
      const token = await userData.getIdToken();

      cookie.set("auth-token", token);
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      cookie.remove("auth-token");
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update error handling in reducers
const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user =  action.payload
        ? {
            uid: action.payload.uid,
            email: action.payload.email,
            displayName: action.payload.displayName,
            emailVerified: action.payload.emailVerified,
            photoURL: action.payload.photoURL,
            providerData: action.payload.providerData,
            accessToken: action.payload.accessToken,
          }
        : null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        setUser(action.payload);
        state.loading = false;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // register
      .addCase(registerWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        setUser(action.payload);
        state.loading = false;
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // google
      .addCase(signWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signWithGoogle.fulfilled, (state, action) => {
        setUser(action.payload);
        state.loading = false;
      })
      .addCase(signWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // facebook
      .addCase(signWithFacebook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signWithFacebook.fulfilled, (state, action) => {
        setUser(action.payload);
        state.loading = false;
      })
      .addCase(signWithFacebook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // apple
      .addCase(signWithApple.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signWithApple.fulfilled, (state, action) => {
        setUser(action.payload);
        state.loading = false;
      })
      .addCase(signWithApple.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // logOut
      .addCase(logOut.fulfilled, (state) => {
        setUser(null);
        state.loading = false;
      });
  },
});

export const { setUser, setLoading, setError } = authReducer.actions;

// Auth state listener
export const listenToAuthChanges = () => (dispatch) => {
  auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      cookie.set("auth-token",firebaseUser?.accessToken)
      dispatch(setUser(firebaseUser));
    } else {
      cookie.remove("auth-token")
      dispatch(setUser(null));
    }
  });
};

export default authReducer.reducer;
