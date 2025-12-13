import { html } from '@arrow-js/core'; 
import '../styles/login.css';

import { appState, navigateTo } from '../app/app.js'; 

const handleLogin = async (event) => {

    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); 
    
    console.log("Data send:", data);

    try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
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
            console.log('Login successful!', result);
            appState.authToken = result.token;
            localStorage.setItem('authToken', result.token);
            appState.isAuthenticated = true;
            navigateTo('dashboard'); 
        } else {
            console.error('Auth Error:', result.message || 'Authentication failed');
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

        <button type="submit" id="login-button">Login</button>
    </form>
</div>
`;

export default Login;