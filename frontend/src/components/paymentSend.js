import { html, reactive } from "@arrow-js/core";
import "../styles/paymentSend.css";
import { navigateTo, API_BASE_URL } from "../app/app";

const state = reactive({
  requester: "",
  username: "",
  email: "",
  phone: "",
  amount: "",
  description: "",
  isLoaded: false,
  error: null,
  currentUuid: null,
  isSubmitting: false,
});

async function fetchDetails(uuid) {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/getDetails/${uuid}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Payment request not found or expired");
    }
    const data = await response.json();
    state.amount = data.amount;
    state.description = data.description;
    state.requester = data.requester;
    state.isLoaded = true;
  } catch (err) {
    state.error = err.message;
    state.isLoaded = true;
  }
}

async function handleSubmit(event, uuid) {
  event.preventDefault();
  if (state.isSubmitting) return;
  state.isSubmitting = true;

  const sendForm = {
    uuid: uuid,
    username: state.username,
    email: state.email,
    phone: state.phone,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/payment/patch`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendForm),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Payment recorded successfully!");
      navigateTo("login");
    } else {
      alert("Error: " + (result.message || result));
    }
  } catch (err) {
    alert("Server connection failed.");
  } finally {
    state.isSubmitting = false;
  }
}

const paymentSend = (uuid) => {
  if (uuid && uuid !== state.currentUuid) {
    state.isLoaded = false;
    state.error = null;
    state.currentUuid = uuid;
    fetchDetails(uuid);
  }

  return html`
    <div id="payment-wrapper">
      ${() => {
        if (state.error) {
          return html`<div class="status-msg">⚠️ ${state.error}</div>`;
        }
        if (!state.isLoaded) {
          return html`<div class="status-msg">Loading payment details...</div>`;
        }

        return html`
          <div class="payment-card">
            <header class="payment-header">
              <h2>Send money to ${state.requester}</h2>
              <p>${state.description}</p>
            </header>

            <div class="payment-split-content">
              <div class="amount-box">
                <span class="label">Total Amount</span>
                <span class="value">${state.amount} RON</span>
              </div>

              <form id="sendForm" @submit="${(e) => handleSubmit(e, uuid)}">
                <div class="field full">
                  <label>Full Name</label>
                  <input type="text" placeholder="Gheorghe Popescu" @input="${(e) => { state.username = e.target.value; }}" required />
                </div>
                <div class="field">
                  <label>Email</label>
                  <input type="email" placeholder="email@example.com" @input="${(e) => { state.email = e.target.value; }}" required />
                </div>
                <div class="field">
                  <label>Phone</label>
                  <input type="tel" placeholder="+4071237891" @input="${(e) => { state.phone = e.target.value; }}" required />
                </div>
                <button type="submit" id="pay-btn" ?disabled="${state.isSubmitting}">
                  ${() => state.isSubmitting ? "Processing..." : "Complete Payment"}
                </button>
              </form>
            </div>
          </div>
        `;
      }}
    </div>
  `;
};

export default paymentSend;