import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCqlATvaYrY8WSJARkwveLEgeSu4sUJ1e4",
  authDomain: "studyhub-b5d24.firebaseapp.com",
  projectId: "studyhub-b5d24",
  storageBucket: "studyhub-b5d24.firebasestorage.app",
  messagingSenderId: "296129047493",
  appId: "1:296129047493:web:36175edf2fae55d4fcf9ac",
  measurementId: "G-445WKH9M4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    const errorMessage = error.message || 'Error al iniciar sesión con Google';
    throw new Error(errorMessage);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export { auth };
