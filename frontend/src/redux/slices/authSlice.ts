import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { getPostsByUser } from "./postSlice";
import { User } from "../../../types";

export const userAuthStateListener = createAsyncThunk(
  "auth/userAuthStateListener",
  async (_, { dispatch }) => {
    FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {
        dispatch(getCurrentUserData());
        dispatch(getPostsByUser(user.uid));
      } else {
        dispatch(setUserState({ currentUser: null, loaded: true }));
      }
    });
  },
);

export const getCurrentUserData = createAsyncThunk(
  "auth/getCurrentUserData",
  async (_, { dispatch }) => {
    if (FIREBASE_AUTH.currentUser) {
      const unsub = onSnapshot(
        doc(FIREBASE_DB, "user", FIREBASE_AUTH.currentUser.uid),
        (res) => {
          if (res.exists()) {
            dispatch(setUserState({ currentUser: res.data(), loaded: true }));
          }
        },
      );
    } else {
      console.log("No user is signed in.");
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }) => {
    const { email, password } = payload;
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to sign in");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload: { email: string; password: string }) => {
    const { email, password } = payload;
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error("Register error:", error);
      throw new Error(error.message || "Failed to create account");
    }
  },
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { dispatch }) => {
    try {
      await firebaseSignOut(FIREBASE_AUTH);
      dispatch(setUserState({ currentUser: null, loaded: true }));
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }
);

interface AuthState {
  currentUser: User | null;
  loaded: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  loaded: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserState: (state, action) => {
      state.currentUser = action.payload.currentUser;
      state.loaded = action.payload.loaded;
    },
  },
  extraReducers: (builder) => {
    // Handle additional cases for async actions if needed
  },
});

export const { setUserState } = authSlice.actions;
export default authSlice.reducer;
