import { html, reactive } from '@arrow-js/core';
import '../styles/app.css';

// 1. Definim și EXPORTĂM starea globală (folosită de alte componente)
export const appState = reactive({
    isAuthenticated: false,
    currentPage: 'login', 
    authToken: localStorage.getItem('authToken') || null 
});

// 2. Definim și EXPORTĂM funcția de navigare
export const navigateTo = (page) => {
    appState.currentPage = page;
};

// 3. Importăm componentele
import Login from '../components/login.js'; 
// 🟢 Import NOU
import Dashboard from '../components/dashboard.js'; 

const root = document.getElementById('app');

// Logica de randare a întregii aplicații
const AppContent = html`
    <div class="container">
        <h1>Flow Payment</h1>
        
        <hr>

        ${() => {
            
            // Verificăm ce pagină trebuie să afișăm:
            if (appState.currentPage === 'dashboard') {
                return Dashboard; // 🟢 Afișează componenta Dashboard
            } 
            
            else { // Implicit, afișăm Login
                return Login; 
            }
        }}

        <hr>
        <footer>© 2025 Flow Payment</footer>
    </div>
`;

AppContent(root);