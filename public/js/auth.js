// Funciones de autenticación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidad de toggle password
    initTogglePassword();
});

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

// Manejar el envío del formulario de inicio de sesión
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log('Iniciando sesión...');
});

// Manejar el envío del formulario de registro
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // Aquí iría la lógica de registro
    console.log('Registrando usuario...');
});
