import { html, reactive } from '@arrow-js/core'; 
import '../styles/paymentSend.css';
import {navigateTo} from '../app/app';

const handleBack = () => {
    navigateTo('dashboard'); 
};

const state = {
    username: '',
    amount: '',
    currency: '',
    description: '',
    expireDate: '',
};

const handleInput = (e) => {
    state[e.target.id] = e.target.value;
};

async function handleSubmit(event){
    event.preventDefault(); 
    
    const sendForm = {
        username: state.username,
        amount: state.amount,
        currency: state.currency,
        description: state.description,
        expireDate: state.expireDate,
    };

    try {
        const response = await fetch ('http://localhost:3001/api/payment/update', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(sendForm),
        });
        
        const result = await response.json();
        console.log(result);

    }catch(err) {
        console.error(err.message);
    };
};

const paymentSend = () => {
    return html`
    <div class="main-content">
    <div class="back-button-container">
        <button id="back-button" @click="${handleBack}">Back to dashboard</button>
    </div>
     <h2 id="title">Send money to friends</h2>
        <form id="sendForm" @submit="${handleSubmit}">
            <label for="username">username</label>
            <input type="text" id="username" @input="${handleInput}">
            <label for="amount">amount</label>
            <input type="number" id="amount" @input="${handleInput}">
            <label for="currency">currency</label>
            <select id="currency" name="currency" @input="${handleInput}">
                <option value="RON">RON</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GDP">GBP</option>
            </select>
            <label for="description">description</label>
            <input type="text" id="description" @input="${handleInput}">
            <label for="expireDate">expire date</label>
            <input type="date" id="expireDate" @input="${handleInput}">
            <button type="submit" id="submit-button">Send money</button>
        </form>
    </div>
`;
};
export default paymentSend;