import React, { useEffect } from 'react';

function Login() {
  useEffect(() => {
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
      button.addEventListener('click', function () {
        const passwordInput = document.getElementById(this.dataset.target);
        if (passwordInput) {
          if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
          } else {
            passwordInput.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
          }
        }
      });
    });
  }, []);
  return (
    <form id="loginForm">
        <div className="input-group">
            <input type="email" id="email" placeholder="Email" required />
        </div>
        <div className="input-group">
            <div className="password-container">
                <input type="password" id="login-password" placeholder="Password" required/>
                <i className="fas fa-eye toggle-password" data-target="login-password"></i>
            </div>
        </div>
        <button type="submit" className="btn-start">Log In</button>
    </form>
  );
}

export default Login;