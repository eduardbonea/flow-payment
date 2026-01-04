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
    console.error("Fetch error:", err);
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
    console.error("Payment submit error:", err);
    alert("Server connection failed. Please try again later.");
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
    <div class="main-content">
      ${() => {

        if (state.error) {
          return html` <div class="error-container">
            <div class="error-icon">⚠️</div>
            <p class="error-msg">${state.error}</p>
            <button
              class="retry-btn"
              @click="${() => window.location.reload()}"
            >
              Try Again
            </button>
          </div>`;
        }

        if (!state.isLoaded) {
          return html` <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching payment details...</p>
          </div>`;
        }

        return html`
          <div class="payment-card">
            <header class="card-header">
              <h2>Send money to ${state.requester}</h2>
              <p class="description">description: ${state.description}</p>
            </header>

            <div class="amount-section">
              <span class="label">Total Amount</span>
              <span class="amount">${state.amount} EUR</span>
            </div>

            <form id="sendForm" @submit="${(e) => handleSubmit(e, uuid)}">
              <div class="input-group">
                <label for="name">Your Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  @input="${(e) => {
                    state.username = e.target.value;
                  }}"
                  required
                />
              </div>

              <div class="input-group">
                <label for="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  @input="${(e) => {
                    state.email = e.target.value;
                  }}"
                  required
                />
              </div>

              <div class="input-group">
                <label for="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+40 7xx xxx xxx"
                  @input="${(e) => {
                    state.phone = e.target.value;
                  }}"
                  required
                />
              </div>

              <button
                type="submit"
                id="submit-button"
                ?disabled="${state.isSubmitting}"
              >
                ${() =>
                  state.isSubmitting ? "Processing..." : "Complete Payment"}
              </button>
            </form>
          </div>
        `;
      }}
    </div>
  `;
};

export default paymentSend;
