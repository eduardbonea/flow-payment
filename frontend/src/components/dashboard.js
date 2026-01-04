import { html, reactive } from '@arrow-js/core'; 
import { appState, navigateTo } from '../app/app.js'; 
import { toDataURL } from 'qrcode';
import '../styles/dashboard.css';

const refreshQRCode = async () => {
    const userId = localStorage.getItem('userId');
    const image = document.getElementById('qrCodeImage');

    if (!userId) {
        console.error("User ID not found.");
        return;
    }

    try {
        const paymentURL = `${window.location.origin}/paymentRequest?toUser=${userId}`;
        const dataURL = await toDataURL(paymentURL, {
            width: 250,
            margin: 2
        });
        
        if (image) {
            image.src = dataURL;
        }
    } catch (err) {
        console.error("Error generating QR:", err);
    }
};

const handleLogout = () => {
    localStorage.removeItem('authToken');
    appState.authToken = null;
    appState.isAuthenticated = false;
    navigateTo('login');
};

const handleProfile = () => {
    navigateTo('profile'); 
};

const paymentRequest = () => {
    navigateTo('paymentRequest'); 
};

const dashboard = html`
<div class="dashboard-pane">
    <div class="top-bar">
        <button id="profile" @click="${handleProfile}">👤 Profile</button>
        <h2 id="title">Dashboard</h2>
        <div class="spacer"></div> </div>
    
    <div class="dashboard-content">
        <div class="account"> 
            <h3 id="account-title">Payments history</h3>
        </div>
        <div class="qr-content">
            <h2 id="qr-title">Scan me to receive money</h2> 
            <div class="qr">
                <img id="qrCodeImage" alt="please refresh QR Code" />
            </div>
            <button id="qr-button" @click="${refreshQRCode}">refresh qr</button>
        </div>
    </div>
    
    <div class="bottom-bar">
        <button id="request" @click="${paymentRequest}">+</button>
        <button id="logout" @click="${handleLogout}">Logout</button>
    </div>
</div>
`;

export default dashboard;