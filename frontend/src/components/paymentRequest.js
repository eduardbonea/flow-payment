import {html, reactive} from '@arrow-js/core'; 
import '../styles/paymentRequest.css';
import {appState, navigateTo, API_BASE_URL} from '../app/app';

const state = reactive({ 
    peopleNo: 1, 
    amount: '',
    description: '',
    expireDate: '',
});

const handleBack = () => {
    navigateTo('dashboard'); 
};

const handleInput = (e) => {
    state[e.target.id] = e.target.value;
};

async function handleSubmit(event) {
    event.preventDefault(); 
    
    const token = appState.authToken;
    
    if (!token) {
        navigateTo('login');
        return;
    }

    const sendForm = {
        amount: state.amount,
        description: state.description,
        expireDate: state.expireDate,
        peopleNo: state.peopleNo,
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
            
            await navigator.clipboard.writeText(shareableLink);
            
            alert(`Success! Link copied to clipboard:\n${shareableLink}`);
            
            navigateTo('dashboard');
        } else {
            alert(`Server Error: ${result.message || 'Could not create request'}`);
        }

    } catch(err) {
        console.error('Connection error:', err);
        alert('Failed to connect to the server.');
    };
};

const paymentRequest = () => {
    return html`
    <div class="main-content">
        <div class="back-button-container">
            <button id="back-button" @click="${handleBack}">Back to dashboard</button>
        </div>
        
        <h2 id="title">Request money from your friends</h2>
        
        <form id="sendForm" @submit="${handleSubmit}">

            <label for="peopleNo">Number of People</label>
            <input type="number" id="peopleNo" @input="${handleInput}" min="1">

            <label for="amount">Total Amount</label>
            <input type="number" id="amount"  @input="${handleInput}" required>

            <label for="description">Description</label>
            <input type="text" id="description" @input="${handleInput}">

            <label for="expireDate">Expire Date</label>
            <input type="date" id="expireDate" @input="${handleInput}" required>

            <button type="submit" id="submit-button">Create & Copy Link</button>

        </form>
    </div>
`;
};

export default paymentRequest;