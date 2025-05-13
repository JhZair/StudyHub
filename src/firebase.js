// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration
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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Función para iniciar sesión con Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
};

// Función para cerrar sesión
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

export { auth, signInWithGoogle, logout };
