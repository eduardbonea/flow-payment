import { html } from '@arrow-js/core'; 
import '../styles/signup.css';

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
            <button type="submit" id="signin-button">Create account</button>
        </form>
    </div>
`;

export default signup;