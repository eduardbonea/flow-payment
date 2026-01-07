import { html, reactive } from '@arrow-js/core';
import { appState, navigateTo, API_BASE_URL } from '../app/app.js';
import '../styles/profile.css';

const state = reactive({
    user: { id: '', username: '', email: '', password: '', iban: '', revolutLink: '' },
    isEditing: false,
    loading: true
});

const fetchUserProfile = async () => {
    state.loading = true;
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_BASE_URL}/user/getprofile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const dbId = data.id || data._id;
        state.user = { ...data, id: dbId, password: '' };
        if (dbId) localStorage.setItem('userId', dbId);
        state.loading = false;
    } catch (err) {
        console.error(err);
        state.loading = false;
    }
};

const updateField = async (field, endpoint) => {
    const userId = localStorage.getItem('userId') || state.user.id;
    const token = localStorage.getItem('authToken');
    const value = state.user[field];

    if (!userId || userId === 'undefined') return alert("Error: User ID missing.");

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}/${userId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [field]: value })
        });

        if (response.ok) {
            alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated!`);
            if (field === 'password') state.user.password = '';
        } else {
            alert("Update failed.");
        }
    } catch (err) {
        console.error(err);
    }
};

const profileView = html`
<div class="profile-content">
    <div class="profile-header">
        <button id="back-button" @click="${() => navigateTo('dashboard')}"> ⬅️ </button>
        <h2 id="title">User Profile</h2>
    </div>

    ${() => state.loading 
        ? html`<p style="text-align:center; margin-top: 50px;">Loading...</p>`
        : html`
        <div class="profile-form">
            <div class="field-group">
                <label>Username</label>
                <div class="input-row">
                    <input type="text" value="${() => state.user.username}" 
                        readonly="${() => !state.isEditing}" 
                        @input="${e => state.user.username = e.target.value}" />
                    ${() => state.isEditing ? html`<button class="save-btn" @click="${() => updateField('username', '/user/patchusername')}">Save</button>` : ''}
                </div>
            </div>

            <div class="field-group">
                <label>Email</label>
                <div class="input-row">
                    <input type="email" value="${() => state.user.email}" 
                        readonly="${() => !state.isEditing}" 
                        @input="${e => state.user.email = e.target.value}" />
                    ${() => state.isEditing ? html`<button class="save-btn" @click="${() => updateField('email', '/user/patchemail')}">Save</button>` : ''}
                </div>
            </div>

            <div class="field-group">
                <label>New Password</label>
                <div class="input-row">
                    <input type="password" placeholder="••••••••" 
                        readonly="${() => !state.isEditing}" 
                        @input="${e => state.user.password = e.target.value}" />
                    ${() => state.isEditing ? html`<button class="save-btn" @click="${() => updateField('password', '/user/patchpassword')}">Save</button>` : ''}
                </div>
            </div>

            <div class="field-group">
                <label>IBAN</label>
                <div class="input-row">
                    <input type="text" value="${() => state.user.iban}" 
                        readonly="${() => !state.isEditing}" 
                        @input="${e => state.user.iban = e.target.value}" />
                    ${() => state.isEditing ? html`<button class="save-btn" @click="${() => updateField('iban', '/user/patchiban')}">Save</button>` : ''}
                </div>
            </div>

            <div class="field-group">
                <label>Revolut Link</label>
                <div class="input-row">
                    <input type="text" value="${() => state.user.revolutLink}" 
                        readonly="${() => !state.isEditing}" 
                        @input="${e => state.user.revolutLink = e.target.value}" />
                    ${() => state.isEditing ? html`<button class="save-btn" @click="${() => updateField('revolutLink', '/user/patchrevlink')}">Save</button>` : ''}
                </div>
            </div>
        </div>

        <button id="edit-toggle" @click="${() => state.isEditing = !state.isEditing}">
            ${() => state.isEditing ? 'Finish Editing' : 'Edit Profile'}
        </button>
    `}
</div>
`;

export default () => {
    fetchUserProfile();
    return profileView;
};