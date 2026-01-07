import { html, reactive } from '@arrow-js/core';
import '../styles/paymentRequest.css';
import { appState, navigateTo, API_BASE_URL } from '../app/app';

const state = reactive({ 
    peopleNo: 1, 
    amount: '',
    description: '',
    expireDate: '',
    showModal: false,
    generatedLink: ''
});

const handleBack = () => {
    navigateTo('dashboard'); 
};

const handleCloseModal = () => {
    state.showModal = false;
    navigateTo('dashboard');
};

const handleCopyLink = async () => {
    if (state.generatedLink) {
        await navigator.clipboard.writeText(state.generatedLink);
        const copyBtn = document.getElementById('copy-btn');
        if(copyBtn) copyBtn.innerText = 'Copied!';
        setTimeout(() => {
            if(copyBtn) copyBtn.innerText = 'Copy Link';
        }, 2000);
    }
};

async function handleSubmit(event) {
    event.preventDefault(); 
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        alert("Session expired.");
        navigateTo('login');
        return;
    }

    const sendForm = {
        amount: Number(state.amount),
        description: state.description,
        expireDate: state.expireDate,
        peopleNo: Number(state.peopleNo),
    };

    try {
        const response = await fetch(`${API_BASE_URL}/payment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(sendForm),
        });
        
        const result = await response.json();
        
        if (response.ok) {
            const shareableLink = `${window.location.origin}/pay/${result.uuid}`;
            state.generatedLink = shareableLink;
            state.showModal = true;
            // Copiem automat și în background pentru UX
            navigator.clipboard.writeText(shareableLink).catch(() => {});
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch(err) {
        console.error(err);
    }
}

const paymentRequest = () => {
    return html`
    <div class="payment-request-wrapper">
        <div class="payment-card">
            <div class="card-header">
                <button class="back-btn" @click="${handleBack}">⬅ Back</button>
            </div>
            
            <h2 class="card-title">Request Money</h2>
            
            <form class="payment-form" @submit="${handleSubmit}">
                <div class="form-row">
                    <label>People</label>
                    <input 
                        type="number" 
                        value="${() => state.peopleNo}" 
                        @input="${(e) => state.peopleNo = e.target.value}" 
                        min="1"
                    >
                </div>

                <div class="form-row">
                    <label>Amount (RON)</label>
                    <input 
                        type="number" 
                        value="${() => state.amount}" 
                        @input="${(e) => state.amount = e.target.value}" 
                        required
                    >
                </div>

                <div class="form-row">
                    <label>Description</label>
                    <input 
                        type="text" 
                        value="${() => state.description}" 
                        @input="${(e) => state.description = e.target.value}"
                    >
                </div>

                <div class="form-row">
                    <label>Expire Date</label>
                    <input 
                        type="date" 
                        value="${() => state.expireDate}" 
                        @input="${(e) => state.expireDate = e.target.value}" 
                        required
                    >
                </div>

                <button type="submit" class="submit-btn">Create Link</button>
            </form>
        </div>

        ${() => state.showModal ? html`
        <div class="modal-overlay">
            <div class="modal-content">
                <h3>Link Created!</h3>
                <p>Share this link with your friends:</p>
                <div class="link-box">
                    <input type="text" value="${state.generatedLink}" readonly>
                </div>
                <div class="modal-actions">
                    <button id="copy-btn" class="modal-btn copy" @click="${handleCopyLink}">Copy Link</button>
                    <button class="modal-btn close" @click="${handleCloseModal}">Done</button>
                </div>
            </div>
        </div>
        ` : ''}
    </div>
    `;
};

export default paymentRequest;