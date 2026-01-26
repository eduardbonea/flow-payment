import { html, reactive } from '@arrow-js/core';
import '../styles/app.css';

import Login from '../components/login.js';
import Dashboard from '../components/dashboard.js';
import PaymentSend from '../components/paymentSend.js';
import PaymentRequest from '../components/paymentRequest.js';
import SignUp from '../components/signup.js';
import Profile from '../components/profile.js';

export const API_BASE_URL = 'http://localhost:3003/api';

const root = document.getElementById('app');
const initialAuthToken = localStorage.getItem('authToken');
const currentPath = window.location.pathname;

let startPage = initialAuthToken ? 'dashboard' : 'login';
let startUuid = null;

if (currentPath.startsWith('/pay/')) {
    const parts = currentPath.split('/');
    startUuid = parts[2] || parts[1];
    startPage = 'paymentSend';
} else if (currentPath === '/signup') {
    startPage = 'signup';
} else if (initialAuthToken) {
    const pageName = currentPath.replace('/', '');
    if (pageName && pageName !== 'login') {
        startPage = pageName;
    }
}

export const appState = reactive({
    isAuthenticated: !!initialAuthToken,
    currentPage: startPage,
    authToken: initialAuthToken,
    paymentId: startUuid
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

const AppContent = html`
    <div class="container">
        <h1 id="general-title" @click="${() => { if(appState.isAuthenticated) navigateTo('dashboard'); }}" style="cursor: pointer;">
            Flow Payment
        </h1>
        <hr>

        ${() => {
            if (appState.currentPage === 'signup') {
                return SignUp;
            }

            if (appState.currentPage === 'paymentSend') {
                return PaymentSend(appState.paymentId);
            }

            if (!appState.isAuthenticated) {
                return Login;
            }
            
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

window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    if (path.startsWith('/pay/')) {
        const uuid = path.split('/')[2];
        appState.paymentId = uuid;
        appState.currentPage = 'paymentSend';
    } else if (path === '/signup') {
        appState.currentPage = 'signup';
    } else {
        const page = path.replace('/', '') || (appState.isAuthenticated ? 'dashboard' : 'login');
        appState.currentPage = page;
    }
});

root.innerHTML = '';
AppContent(root);