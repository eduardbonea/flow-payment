import { html, reactive } from '@arrow-js/core';
import '../styles/app.css';

import Login from '../components/login.js';
import Dashboard from '../components/dashboard.js';
import PaymentSend from '../components/paymentSend.js';
import PaymentRequest from '../components/paymentRequest.js';
import SignUp from '../components/signup.js';
import Profile from '../components/profile.js';

export const API_BASE_URL = 'http://localhost:3001/api';

const initialAuthToken = localStorage.getItem('authToken');

export const appState = reactive({
    isAuthenticated: !!initialAuthToken,
    currentPage: initialAuthToken ? 'dashboard' : 'login',
    authToken: initialAuthToken,
    paymentId: null 
});

export const navigateTo = (path) => {
    if (path.startsWith('pay/')) {
        const uuid = path.split('/')[1];
        appState.paymentId = uuid;
        appState.currentPage = 'paymentSend';
        window.history.pushState({ page: 'paymentSend', uuid }, '', `/pay/${uuid}`);
    } else {
        appState.currentPage = path;
        const urlPath = path === 'dashboard' ? '/' : `/${path}`;
        window.history.pushState({ page: path }, '', urlPath);
    }
};

export const setAuthToken = (token) => {
    appState.authToken = token;
    appState.isAuthenticated = !!token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
    }
};

export const logout = () => {
    setAuthToken(null);
    navigateTo('login');
};

const root = document.getElementById('app');

const AppContent = html`
    <div class="container">
        <h1 id="general-title" @click="${() => navigateTo('dashboard')}" style="cursor: pointer;">
            Flow Payment
        </h1>
        <hr>

        ${() => {
            // PUBLIC ROUTES
            if (appState.currentPage === 'signup') {
                return SignUp;
            }

            if (appState.currentPage === 'paymentSend') {
                return PaymentSend(appState.paymentId);
            }

            // AUTH GUARD
            if (!appState.isAuthenticated) {
                return Login;
            }
            
            // PROTECTED ROUTES
            switch (appState.currentPage) {
                case 'dashboard':
                    return Dashboard;
                case 'paymentRequest':
                    return PaymentRequest();
                case 'profile':
                    return Profile();
                default:
                    return Dashboard;
            }
        }}

        <hr>
        <footer id="general-footer">© 2026 Flow Payment</footer>
    </div>
`;

window.addEventListener('load', () => {
    const path = window.location.pathname;
    
    if (path.startsWith('/pay/')) {
        const uuid = path.split('/')[2];
        if (uuid) {
            appState.paymentId = uuid;
            appState.currentPage = 'paymentSend';
        }
    } else if (path === '/signup') {
        appState.currentPage = 'signup';
    } else if (appState.isAuthenticated) {
        const page = path.replace('/', '');
        appState.currentPage = page || 'dashboard';
    } else {
        appState.currentPage = 'login';
    }
});

window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    if (path.startsWith('/pay/')) {
        const uuid = path.split('/')[2];
        appState.paymentId = uuid;
        appState.currentPage = 'paymentSend';
    } else {
        const page = path.replace('/', '') || (appState.isAuthenticated ? 'dashboard' : 'login');
        appState.currentPage = page;
    }
});

AppContent(root);