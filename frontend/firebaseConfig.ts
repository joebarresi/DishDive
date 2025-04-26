import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

//! REPLACE VALUES BELOW WITH YOUR OWN FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBZG8ZOSO18K300LWhCsSSiqk-FjxM2Pyo",
  authDomain: "recipetok-40c2a.firebaseapp.com",
  databaseURL: "https://recipetok-40c2a-default-rtdb.firebaseio.com",
  projectId: "recipetok-40c2a",
  storageBucket: "recipetok-40c2a.firebasestorage.app",
  messagingSenderId: "280093415880",
  appId: "1:280093415880:web:e5bd0c7e15fa66b50848fd",
  measurementId: "G-W7K3GRQBZQ"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIREBASE_FUNCTIONS = getFunctions(FIREBASE_APP);
