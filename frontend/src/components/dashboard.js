import { html } from '@arrow-js/core'; 
import { appState, navigateTo } from '../app/app.js'; 
import '../styles/dashboard.css';

const handleLogout = () => {

    appState.isAuthenticated = false;
    appState.authToken = null;
    
    navigateTo('login');
    
    localStorage.removeItem('authToken');
};

const dashboard = html`
<div class="dashboard-pane">
    <h2>Dashboard</h2>
    
    <div class="dashboard-content">
        <div class="account"> 
            <h3>Payment details</h3>
        </div>
        <div class="buttons"> 
            <button>Send</button>
            <button>Recive</button>
        </div>
        <div class="qr-content">
            <h2>Scan me to recive money</h2> 
            <div class = "qr">
                <p>insert qr code</p>
            </div>
            <button>refresh qr</button>
        </div>
    </div>
    
    <button @click="${handleLogout}">Deconectare</button>
</div>
`;

export default dashboard;