import { html } from '@arrow-js/core'; 
import '../styles/login.css';

import { appState, navigateTo } from '../app/app.js'; 


// Funcția care gestionează trimiterea formularului
const handleLogin = async (event) => {

    // Previne reîncărcarea paginii
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Convertește FormData în obiect JSON (format așteptat de backend)
    const data = Object.fromEntries(formData.entries()); 
    
    console.log("Data send:", data);

    try {
        // 🛑 Cererea POST către ruta corectă
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Încercăm să citim răspunsul ca JSON (chiar și la erori 4xx/5xx)
        let result = {};
        try {
            result = await response.json();
        } catch (e) {
            // Dacă răspunsul nu este JSON valid (ex: un 500 gol), creăm un mesaj de eroare generic
            result.message = `Eroare HTTP: ${response.status} (${response.statusText})`;
        }


        if (response.ok) {
            // ✅ LOGIN REUȘIT (200 OK)
            console.log('Login successful!', result);
            
            // 1. Salvează token-ul (pentru cererile viitoare)
            appState.authToken = result.token;
            localStorage.setItem('authToken', result.token);

            // 2. Setează autentificarea pe TRUE (schimbă starea globală)
            appState.isAuthenticated = true;
            
            // 3. Schimbă pagina curentă (Declanșează re-randarea în app.js)
            navigateTo('dashboard'); 

        } else {
            // 🛑 EROARE DE AUTENTIFICARE (401 Unauthorized / 500 Internal Server Error)
            console.error('Auth Error:', result.message || 'Authentication failed');
            alert(result.message || 'Eroare de autentificare. Te rog verifică credențialele.'); // Afișează o alertă simplă
        }

    } catch (error) {
        // 🛑 EROARE DE REȚEA (Serverul este oprit sau nu este accesibil)
        console.error('Network Error:', error);
        alert('Eroare de rețea. Asigură-te că serverul (Backend) rulează.');
    }
};

// Componenta ArrowJS
const Login = html`
<div class = "login-pane">
    <h2>Login</h2>
    <form @submit="${handleLogin}">
        
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <button type="submit">Login</button>
    </form>
</div>
`;

export default Login;