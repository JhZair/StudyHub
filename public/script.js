// Importar las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCqlATvaYrY8WSJARkwveLEgeSu4sUJ1e4",
    authDomain: "studyhub-b5d24.firebaseapp.com",
    projectId: "studyhub-b5d24",
    storageBucket: "studyhub-b5d24.firebasestorage.app",
    messagingSenderId: "296129047493",
    appId: "1:296129047493:web:36175edf2fae55d4fcf9ac",
    measurementId: "G-445WKH9M4W"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;

            if (passwordInput && (passwordInput.type === 'password' || passwordInput.type === 'text')) {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                this.classList.toggle('fa-eye', isPassword);
                this.classList.toggle('fa-eye-slash', !isPassword);
            }
        });
    });

    ['loginForm', 'signupForm'].forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log(`${formId.replace('Form', '')} attempt:`);
                window.location.href = "index.html";
            });
        }
    });

    // Manejar inicio de sesión con Google
    document.getElementById('google-sign-up').addEventListener('click', () => {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                // Usuario autenticado
                const user = result.user;
                console.log('Usuario autenticado:', user);

                // Redirigir al usuario o mostrar un mensaje
                window.location.href = "dashboard.html"; // Cambia a la página que desees
            })
            .catch((error) => {
                console.error('Error al iniciar sesión con Google:', error);
            });
    });

    // Manejar estado de autenticación
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in:", user);
        } else {
            console.log("User is signed out");
            window.location.href = "index.html";
        }
    });

    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        document.getElementById("google-sign-in")?.addEventListener("click", googleSignIn);
    }
});