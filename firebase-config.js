// Centralized Firebase Service for Faisal Shameem Engineering Portfolio
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfyNJe-7VBUNALUAZb8tKRl2pZGe4KAzw",
  authDomain: "my-website-7e631.firebaseapp.com",
  projectId: "my-website-7e631",
  storageBucket: "my-website-7e631.firebasestorage.app",
  messagingSenderId: "368013659922",
  appId: "1:368013659922:web:eceb6ab719767798ebedcb",
  measurementId: "G-B812X1H00K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Export everything for use in other files
export { app, analytics, auth, db, googleProvider, firebaseConfig };