document.addEventListener('DOMContentLoaded', () => {
    // Simulación de una base de datos de usuarios
    const users = [
        { username: "testuser", password: "password123", email: "testuser@example.com" }
    ];

    // Función para mostrar mensajes en la interfaz
    const showMessage = (message, type) => {
        const messageDiv = document.querySelector('.message');
        if (messageDiv) {
            messageDiv.innerHTML = message; // Usamos innerHTML para permitir enlaces
            messageDiv.classList.remove('success', 'error');
            messageDiv.classList.add(type);
            messageDiv.style.display = 'block';
            // Ocultar el mensaje después de 5 segundos para dar tiempo a leer y hacer clic
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    };

    // Simulación de login
    const simulateLogin = (username, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(u => u.username === username && u.password === password);
                if (user) {
                    resolve({ success: true, message: "Login successful! Redirecting..." });
                } else {
                    reject({ success: false, message: "Invalid username or password. If you don't have an account, <a href='signup.html'>sign up here</a>." });
                }
            }, 1000); // Simula un retraso de 1 segundo
        });
    };

    // Simulación de registro
    const simulateSignup = (username, email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const userExists = users.some(u => u.username === username || u.email === email);
                if (userExists) {
                    reject({ success: false, message: "Username or email already exists." });
                } else {
                    users.push({ username, email, password });
                    resolve({ success: true, message: "Registration successful! Redirecting..." });
                }
            }, 1000); // Simula un retraso de 1 segundo
        });
    };

    // Manejo del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            // Validación básica
            if (!username || !password) {
                showMessage("Please fill in all fields.", 'error');
                return;
            }

            try {
                const response = await simulateLogin(username, password);
                showMessage(response.message, 'success');
                // Simula redirección después de un login exitoso
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; // Cambia a la página que desees
                }, 2000);
            } catch (error) {
                showMessage(error.message, 'error');
            }
        });
    }

    // Manejo del formulario de registro
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('signup-password').value;

            // Validación básica
            if (!username || !email || !password) {
                showMessage("Please fill in all fields.", 'error');
                return;
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                showMessage("Please enter a valid email address.", 'error');
                return;
            }

            try {
                const response = await simulateSignup(username, email, password);
                showMessage(response.message, 'success');
                // Simula redirección después de un registro exitoso
                setTimeout(() => {
                    window.location.href = 'login.html'; // Redirige al login después de registrarse
                }, 2000);
            } catch (error) {
                showMessage(error.message, 'error');
            }
        });
    }

    // Toggle password visibility
    const togglePasswordElements = document.querySelectorAll('.toggle-password');
    togglePasswordElements.forEach(element => {
        element.addEventListener('click', () => {
            const targetId = element.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                element.classList.remove('fa-eye');
                element.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                element.classList.remove('fa-eye-slash');
                element.classList.add('fa-eye');
            }
        });
    });
});