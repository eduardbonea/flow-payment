import { html, reactive } from '@arrow-js/core'; 
import '../styles/login.css';

import { appState, navigateTo, setAuthToken, API_BASE_URL } from '../app/app.js'; 

const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    } catch (e) {
        return null;
    }
};

const handleLogin = async (event) => {

    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); 

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        let result = {};
        try {
            result = await response.json();
        } catch (e) {
            result.message = `Eroare HTTP: ${response.status} (${response.statusText})`;
        }

        if (response.ok) {
            appState.authToken = result.token;
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userId', result.userId);
            appState.isAuthenticated = true;
            navigateTo('dashboard'); 
            console.log(result.token);
        } else {
            console.error('Auth Error:');
        }
        } catch (error) {
            console.error('Network Error:', error);
        }
};

const Login = html`
<div class = "login-pane">
    <h2 id="title-login">Login Page</h2>
    <form @submit="${handleLogin}">
        
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <div class="button-group">
            <button type="submit" id="login-button">Login</button>
            <button 
                type="button" 
                id="signup-button" 
                @click="${() => navigateTo('signup')}"
            >
                Create Account
            </button>
    </form>

</div>
`;

export default Login;