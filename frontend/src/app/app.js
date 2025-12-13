import { html, reactive } from '@arrow-js/core';
import '../styles/app.css';

const initialAuthToken = localStorage.getItem('authToken');

export const appState = reactive({
    isAuthenticated: !!initialAuthToken,
    currentPage: initialAuthToken ? 'dashboard' : 'login', 
    authToken: initialAuthToken
});

export const navigateTo = (page) => {
    appState.currentPage = page;
    console.log(`Navigating to: ${page}`);
};

import Login from '../components/login.js'; 
import Dashboard from '../components/dashboard.js';
import PaymentSend from '../components/paymentSend.js'
import PaymentRequest from '../components/paymentRequest.js' 

const root = document.getElementById('app');

const AppContent = html`
    <div class="container">
        <h1>Flow Payment</h1>
        
        <hr>

        ${() => {
            
            if (!appState.isAuthenticated) {
                appState.currentPage = 'login'; 
                return Login;
            } 
            
            switch (appState.currentPage) {
                case 'dashboard':
                    return Dashboard;
                
                case 'paymentSend':
                    return PaymentSend;
                    
                case 'paymentRequest':
                    return PaymentRequest;
                    
                case 'login':
                default:
                    return Dashboard;
            }
        }}

        <hr>
        <footer>© 2025 Flow Payment</footer>
    </div>
`;

AppContent(root);