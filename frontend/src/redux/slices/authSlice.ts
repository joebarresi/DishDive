import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { getPostsByUser } from "./postSlice";
import { User } from "../../types";

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
      const firebaseUser = FIREBASE_AUTH.currentUser;
      
      // First check if the user document exists in Firestore
      const userDocRef = doc(FIREBASE_DB, "user", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // If the document exists, set up a listener for future updates
        const unsub = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            dispatch(setUserState({ 
              currentUser: doc.data() as User, 
              loaded: true 
            }));
          }
        });
      } else {
        // If the document doesn't exist yet, create a basic user object from auth
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL || undefined,
          bio: "",
          following: [],
          followers: []
        };
        
        // Set the user state with the auth data while we create the Firestore document
        dispatch(setUserState({ currentUser: userData, loaded: true }));
        
        // Create the user document in Firestore
        try {
          await setDoc(userDocRef, userData);
        } catch (error) {
          console.error("Error creating user document:", error);
        }
      }
    } else {
      console.log("No user is signed in.");
      dispatch(setUserState({ currentUser: null, loaded: true }));
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
  async (payload: { email: string; password: string, username: string }) => {
    const { email, password, username } = payload;
    try {
      let userCredential;
      await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
        .then((user) => {
          console.log("Successfully created new user.")
          userCredential = user;

          // Only update the displayName if a username was provided
          // For our new flow, we'll leave this empty and set it in the onboarding screen
          if (username) {
            let firebaseUser = FIREBASE_AUTH.currentUser;
            return updateProfile(firebaseUser!, {
              displayName: username
            });
          }
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
      return userCredential!.user;
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

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (payload: { displayName?: string; photoURL?: string; bio?: string }, { dispatch }) => {
    try {
      const firebaseUser = FIREBASE_AUTH.currentUser;
      
      if (!firebaseUser) {
        throw new Error("No user is signed in");
      }
      
      // Update Firebase Auth profile if displayName or photoURL is provided
      if (payload.displayName || payload.photoURL) {
        const authUpdate: { displayName?: string; photoURL?: string } = {};
        if (payload.displayName) authUpdate.displayName = payload.displayName;
        if (payload.photoURL) authUpdate.photoURL = payload.photoURL;
        
        await updateProfile(firebaseUser, authUpdate);
      }
      
      // Update Firestore document
      const userDocRef = doc(FIREBASE_DB, "user", firebaseUser.uid);
      await setDoc(userDocRef, payload, { merge: true });
      
      // Refresh user data
      dispatch(getCurrentUserData());
      
      return true;
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw new Error(error.message || "Failed to update profile");
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
