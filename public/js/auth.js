console.log('Inicializando Firebase...');

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

// Variables globales para autenticación
let auth;
let googleProvider;

// Inicializar Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase inicializado correctamente');
    
    auth = firebase.auth();
    console.log('Auth inicializado:', auth ? 'Sí' : 'No');
    
    googleProvider = new firebase.auth.GoogleAuthProvider();
    console.log('Google Provider inicializado:', googleProvider ? 'Sí' : 'No');
    
    // Hacer que las variables sean globales para depuración
    window.firebaseAuth = auth;
    window.googleProvider = googleProvider;
    
} catch (error) {
    console.error('Error al inicializar Firebase:', error);
}

// Funciones de autenticación
function initializeAuth() {
    console.log('Inicializando autenticación...');
    
    // Inicializar funcionalidad de toggle password
    initTogglePassword();
    
    // Agregar manejadores para los botones de Google
    const googleLoginBtn = document.getElementById('google-login-btn');
    const googleSignupBtn = document.getElementById('google-signup-btn');
    
    console.log('Botón de login de Google encontrado:', googleLoginBtn ? 'Sí' : 'No');
    console.log('Botón de registro de Google encontrado:', googleSignupBtn ? 'Sí' : 'No');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleSignIn);
        console.log('Manejador de clic agregado al botón de login de Google');
    }
    
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', handleGoogleSignIn);
        console.log('Manejador de clic agregado al botón de registro de Google');
    }
}

// Inicializar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}

// Función para alternar la visibilidad de la contraseña
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.querySelector(`[onclick="togglePassword('${inputId}')"] i`);
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Inicializar los listeners para los botones de toggle password
function initTogglePassword() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inputId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            togglePassword(inputId);
        });
    });
}

// Manejar inicio de sesión con Google
function handleGoogleSignIn(e) {
    console.log('handleGoogleSignIn llamado');
    if (e) {
        e.preventDefault();
        console.log('Evento preventDefault() llamado');
    }
    
    // Verificar que las variables estén definidas
    if (!auth || !googleProvider) {
        console.error('Error: auth o googleProvider no están definidos');
        showError('Error de configuración. Por favor, recarga la página.');
        return;
    }
    
    console.log('Iniciando autenticación con Google...');
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            // El usuario ha iniciado sesión correctamente
            const user = result.user;
            console.log('Usuario autenticado con Google:', user);
            // Redirigir a la página principal después del inicio de sesión exitoso
            console.log('Redirigiendo a la página principal...');
            window.location.href = '/';
        })
        .catch((error) => {
            console.error('Error al iniciar sesión con Google:', error);
            showError(error.message);
        });
}

// Mostrar mensajes de error
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.marginTop = '10px';
    errorDiv.style.padding = '10px';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.backgroundColor = '#ffebee';
    
    const form = document.querySelector('form');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Manejar el envío del formulario de inicio de sesión
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            // Redirigir a la página principal después del inicio de sesión exitoso
            window.location.href = '/';
        })
        .catch((error) => {
            console.error('Error al iniciar sesión:', error);
            showError(error.message);
        });
});

// Manejar el envío del formulario de registro
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    const confirmPassword = this.querySelector('input[type="password"]:last-of-type').value;
    
    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            // Redirigir a la página principal después del registro exitoso
            window.location.href = '/';
        })
        .catch((error) => {
            console.error('Error al registrar usuario:', error);
            showError(error.message);
        });
});
