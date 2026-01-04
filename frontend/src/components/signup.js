import {html} from '@arrow-js/core'; 
import '../styles/signup.css';
import {navigateTo, API_BASE_URL} from '../app/app.js';

const handleSignup = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); 

    try {
        const response = await fetch(`${API_BASE_URL}/user/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Account created successfully!');
            navigateTo('login');
        } else {
            const result = await response.json();
            alert(`Error: ${result.message || 'Signup failed'}`);
        }
    } catch (error) {
        console.error('Network Error:', error);
    }
};

const signup = html`
    <div class="main-content">
        <h2 id="title">Create new account</h2>
        <form @submit="${handleSignup}">
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username" required><br><br>
            
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required><br><br>
            
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br><br>

            <label for="iban">IBAN:</label><br>
            <input type="text" id="iban" name="iban" required><br><br>

            <label for="revolutLink">Revolut payment link:</label><br>
            <input type="text" id="revolutLink" name="revolutLink" required><br><br>
            
            <div class="button-group">
                <button type="submit" id="signin-button">Create account</button>
                <button type="button" class="secondary-button" @click="${() => navigateTo('login')}">
                    Back to Login
                </button>
            </div>
        </form>
    </div>
`;

export default signup;