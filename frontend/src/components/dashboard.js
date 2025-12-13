import { html } from '@arrow-js/core'; 
import { appState, navigateTo } from '../app/app.js'; 
import '../styles/dashboard.css';

const handleLogout = () => {
    localStorage.removeItem('authToken');
    appState.authToken = null;
    appState.isAuthenticated = false;
    navigateTo('login');
};

const paymentSend = () => {
    navigateTo('paymentSend'); 
};

const paymentRequest = () => {
    navigateTo('paymentRequest'); 
};

const dashboard = html`
<div class="dashboard-pane">
    <h2 id = "title">Dashboard</h2>
    
    <div class="dashboard-content">
        <div class="account"> 
            <h3 id = "account-title">Payment details</h3>
        </div>
        <div class="buttons"> 
            <button id = "button-send" @click="${paymentSend}">Send</button>
            <button id = "button-recive"@click="${paymentRequest}">Recive</button>
        </div>
        <div class="qr-content">
            <h2 id = "qr-title">Scan me to recive money</h2> 
            <div class = "qr">
                <p>insert qr code</p>
            </div>
            <button id = "qr-button">refresh qr</button>
        </div>
    </div>
    
    <button id = "logout" @click="${handleLogout}">Logout</button>
</div>
`;

export default dashboard;