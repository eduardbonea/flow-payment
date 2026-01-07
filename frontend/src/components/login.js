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

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', result.token);
            
            // DECODARE JWT PENTRU ID
            try {
                const payload = JSON.parse(atob(result.token.split('.')[1]));
                const userId = payload.id || payload.sub; // Căutăm 'id' în token
                localStorage.setItem('userId', userId);
                console.log("ID extras cu succes:", userId);
            } catch (e) {
                console.error("Nu am putut extrage ID-ul din token:", e);
            }

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
                    <label>Username</label>
                    <input type="text" name="username" required>
                    <label>Password</label>
                    <input type="password" name="password" required>
                    <div class="button-group">
                        <button type="submit" id="login-button">Sign In</button>
                        <button type="button" @click="${() => navigateTo('signup')}">Sign up</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;
export default Login;