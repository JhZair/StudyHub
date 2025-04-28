// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    console.log('Login attempt:', { username, password, remember });
    // Here you would typically send this data to your server
    alert('Login functionality would be implemented here');
});

// Signup form submission
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('signup-password').value;
    const remember = document.getElementById('signup-remember').checked;
    
    console.log('Signup attempt:', { email, password, remember });
    // Here you would typically send this data to your server
    alert('Signup functionality would be implemented here');
});

/* filepath: /home/a13xanderplatz/Documentos/dbp/script.js */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los botones de toggle de contraseña
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Obtener el campo de contraseña relacionado
            const passwordInput = document.getElementById(this.dataset.target);

            // Verificar si el campo de contraseña existe
            if (passwordInput) {
                // Cambiar el tipo de input entre 'password' y 'text'
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash'); // Cambiar el ícono a ojo tachado
                } else {
                    passwordInput.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye'); // Cambiar el ícono a ojo normal
                }
            }
        });
    });

    // Verificar si estamos en la página de signup
    if (document.getElementById('signupForm')) {
        // Obtener el formulario de signup
        const signupForm = document.getElementById('signupForm');
        
        // Agregar evento submit al formulario
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir envío por defecto
            
            // Aquí puedes agregar la lógica de registro
            console.log('Formulario de registro enviado');
        });
    }

    // Verificar si estamos en la página de login
    if (document.getElementById('loginForm')) {
        // Obtener el formulario de login
        const loginForm = document.getElementById('loginForm');
        
        // Agregar evento submit al formulario
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir envío por defecto
            
            // Aquí puedes agregar la lógica de inicio de sesión
            console.log('Formulario de login enviado');
        });
    }

    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        themeToggle.checked = savedTheme === 'dark-theme';
    }

    // Alternar entre temas claro y oscuro
    themeToggle.addEventListener('change', function () {
        if (this.checked) {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark-theme'); // Guardar el tema en localStorage
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light-theme'); // Guardar el tema en localStorage
        }
    });
});