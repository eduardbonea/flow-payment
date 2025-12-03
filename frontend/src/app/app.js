import { html, reactive } from '@arrow-js/core';
import '../styles/app.css';
import Login from '../components/login.js'; 

const root = document.getElementById('app');

html`
    <div class="container">
        <h1>Bine ai venit pe Flow Payment</h1>
        <p>Te rugăm să te loghezi pentru a continua.</p>
        
        <hr>

        ${Login}

        <hr>
        <footer>© 2025 Flow Payment</footer>
    </div>
`(root);
