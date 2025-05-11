import React, { useEffect } from 'react';

function Signup() {
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
    <form id="signupForm">
        <div className="social-login">
            <button className="social-btn google"><i className="fa-brands fa-google"></i> Sign in with Google</button>
            <button className="social-btn twitter"><i className="fa-brands fa-x-twitter"></i> Twitter</button>
            <button className="social-btn apple"><i className="fa-brands fa-apple"></i> Apple</button>
        </div>
        <div className="divider">or</div>
        <div className="input-group">
            <input type="text" id="signup-username" placeholder="Username" required />
        </div>
        <div className="input-group">
            <input type="email" id="signup-email" placeholder="Email" required />
        </div>
        <div className="input-group">
            <div className="password-container">
                <input type="password" id="signup-password" placeholder="Password" required/>
                <i className="fas fa-eye toggle-password" data-target="signup-password"></i>
            </div>
        </div>
        <button type="submit" className="btn-start">Let's Start</button>
    </form>
  );
}

export default Signup;
