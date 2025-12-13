import { html } from '@arrow-js/core'; 
import '../styles/paymentRequest.css';
import {navigateTo} from '../app/app';

const handleBack = () => {
    navigateTo('dashboard'); 
};

const paymentRequest = html`
    <div class="main-content">
    <div class="back-button-container">
        <button id="back-button" @click="${handleBack}">Back to dashboard</button>
    </div>
     <h2 id="title">Request money from friends</h2>
        <form id="requestForm">
            <label for="username">username</label>
            <input type="text" id="username">
            <label for="amount">amount</label>
            <input type="number" id="amount">
            <label for="currency">currency</label>
            <select id="currency" name="currency">
                <option value "" disabled selected>Select a currency</option>
                <option value="RON">RON</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GDP">GBP</option>
            </select>
            <label for="description">description</label>
            <input type="text" id="description">
            <label for="expireDate">expire date</label>
            <input type="date" id="expireDate">
            <button type="submit" id="submit-button">Request money</button>
        </form>
    </div>
`;

export default paymentRequest;