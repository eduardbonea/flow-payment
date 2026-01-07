import { html } from '@arrow-js/core'; 
import '../styles/login.css';
import { appState, navigateTo, API_BASE_URL } from '../app/app.js'; 

const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); 

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        let result = {};
        try {
            result = await response.json();
        } catch (e) {
            result.message = `Eroare HTTP: ${response.status}`;
        }

        if (response.ok) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userId', result.userId);
            appState.isAuthenticated = true;
            navigateTo('dashboard'); 
        } else {
            alert('Login failed: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Network Error:', error);
    }
};

const Login = html`
    <div class="login-wrapper">
        <div class="container">
            <div class="login-pane">
                <h2 id="title-login">Login</h2>
                
                <form @submit="${handleLogin}">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>

                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>

                    <div class="button-group">
                        <button type="submit" id="login-button">Sign In</button>
                        <button type="button" id="signup-button" @click="${() => navigateTo('signup')}">
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;

export default Login;