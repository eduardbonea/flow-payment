import { html, reactive } from '@arrow-js/core';
import {appState, navigateTo, API_BASE_URL} from '../app/app.js';
import '../styles/profile.css';

const state = reactive({
    user: { username: '', email: '', password: '', iban: '', revolutLink: '' },
    isEditing: false,
    loading: true
});

const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    state.loading = true;
    try {

        const response = await fetch(`${API_BASE_URL}/user/getprofile`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        const data = await response.json();
        state.user = { ...data, password: '' }; 
        state.loading = false;
    } catch (err) {
        console.error("Failed to load profile", err);
    }
};

const updateUsername = async () => {
    try {
        const response = await fetch(`/api/user/patchusername`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: state.user.username })
        });
        if (response.ok) alert("Username updated!");
        else alert("Failed to update username");
    } catch (err) {
        console.error(err);
    }
};

const updateEmail = async () => {
    try {
        const response = await fetch(`/api/user/patchemail`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: state.user.email })
        });
        if (response.ok) alert("Email updated!");
        else alert("Failed to update email");
    } catch (err) {
        console.error(err);
    }
};

const updatePassword = async () => {
    if (!state.user.password) return alert("Please enter a new password");
    try {
        const response = await fetch(`/api/user/patchpassword`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: state.user.password })
        });
        if (response.ok) {
            alert("Password updated!");
            state.user.password = ''; // Clear the field
        } else alert("Failed to update password");
    } catch (err) {
        console.error(err);
    }
};

const updateIban = async () => {
    try {
        const response = await fetch(`/api/user/patchiban`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ iban: state.user.iban })
        });
        if (response.ok) alert("IBAN updated!");
        else alert("Failed to update IBAN");
    } catch (err) {
        console.error(err);
    }
};

const updateRevolut = async () => {
    try {
        const response = await fetch(`/api/user/patchrevolut`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ revolutLink: state.user.revolutLink })
        });
        if (response.ok) alert("Revolut link updated!");
        else alert("Failed to update Revolut link");
    } catch (err) {
        console.error(err);
    }
};

const profileView = html`
<div class="dashboard-pane">
    <div class="profile-header">
        <button id="back-button" @click="${() => navigateTo('dashboard')}"> ⬅️ </button>
        <h2 id="title">User Profile</h2>
        <button id="edit-toggle" @click="${() => state.isEditing = !state.isEditing}">
            ${() => state.isEditing ? 'Finish' : 'Edit Profile'}
        </button>
    </div>

    <div class="profile-content">
        ${() => state.loading 
            ? html`<p>Loading...</p>`
            : html`
            <div class="profile-form">
                <div class="field-group">
                    <label>Username</label>
                    <div class="input-row">
                        <input type="text" value="${() => state.user.username}" 
                            readonly="${() => !state.isEditing}" 
                            @input="${e => state.user.username = e.target.value}" />
                        ${() => state.isEditing ? html`<button class="save-btn" @click="${updateUsername}">Save</button>` : ''}
                    </div>
                </div>

                <div class="field-group">
                    <label>Email</label>
                    <div class="input-row">
                        <input type="email" value="${() => state.user.email}" 
                            readonly="${() => !state.isEditing}" 
                            @input="${e => state.user.email = e.target.value}" />
                        ${() => state.isEditing ? html`<button class="save-btn" @click="${updateEmail}">Save</button>` : ''}
                    </div>
                </div>

                <div class="field-group">
                    <label>New Password</label>
                    <div class="input-row">
                        <input type="password" placeholder="••••••••" 
                            readonly="${() => !state.isEditing}" 
                            @input="${e => state.user.password = e.target.value}" />
                        ${() => state.isEditing ? html`<button class="save-btn" @click="${updatePassword}">Save</button>` : ''}
                    </div>
                </div>

                <div class="field-group">
                    <label>IBAN</label>
                    <div class="input-row">
                        <input type="text" value="${() => state.user.iban}" 
                            readonly="${() => !state.isEditing}" 
                            @input="${e => state.user.iban = e.target.value}" />
                        ${() => state.isEditing ? html`<button class="save-btn" @click="${updateIban}">Save</button>` : ''}
                    </div>
                </div>

                <div class="field-group">
                    <label>Revolut Link</label>
                    <div class="input-row">
                        <input type="text" value="${() => state.user.revolutLink}" 
                            readonly="${() => !state.isEditing}" 
                            @input="${e => state.user.revolutLink = e.target.value}" />
                        ${() => state.isEditing ? html`<button class="save-btn" @click="${updateRevolut}">Save</button>` : ''}
                    </div>
                </div>
            </div>
        `}
    </div>
</div>
`;

export default () => {
    fetchUserProfile();
    return profileView;
};