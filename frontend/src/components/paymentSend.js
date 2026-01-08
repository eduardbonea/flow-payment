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
  iban: "",
  revolutLink: "",
  isLoaded: false,
  error: null,
  currentUuid: null,
  isSubmitting: false,
  showModal: false,
  ibanCopied: false,
  isSendingEmail: false,
  errors: {
    username: "",
    email: "",
    phone: "",
  },
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
    state.iban = data.iban || "";
    state.revolutLink = data.revolutLink || "";

    state.isLoaded = true;
  } catch (err) {
    state.error = err.message;
    state.isLoaded = true;
  }
}

function validateForm() {
  let isValid = true;

  if (!state.username.trim() || state.username.trim().split(" ").length < 2) {
    state.errors.username = "Please enter your full name";
    isValid = false;
  } else {
    state.errors.username = "";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(state.email)) {
    state.errors.email = "Please enter a valid email address";
    isValid = false;
  } else {
    state.errors.email = "";
  }

  const phoneRegex = /^07\d{8}$/;
  if (!phoneRegex.test(state.phone)) {
    state.errors.phone = "Please enter a valid phone number (07xxxxxxxx)";
    isValid = false;
  } else {
    state.errors.phone = "";
  }

  return isValid;
}

async function handleSubmit(event, uuid) {
  event.preventDefault();

  if (!validateForm()) return;
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
      state.showModal = true;
    } else {
      alert("Error: " + (result.message || result));
    }
  } catch (err) {
    alert("Server connection failed.");
  } finally {
    state.isSubmitting = false;
  }
}

const copyIban = () => {
  if (state.iban) {
    navigator.clipboard.writeText(state.iban);
    state.ibanCopied = true;
    setTimeout(() => {
      state.ibanCopied = false;
    }, 2000);
  }
};

const openRevolut = () => {
  if (state.revolutLink) {
    const link = state.revolutLink.startsWith("http")
      ? state.revolutLink
      : `https://${state.revolutLink}`;
    window.open(link, "_blank");
  } else {
    alert("No Revolut link provided.");
  }
};

const closeAndFinish = async () => {
  if (state.isSendingEmail) return;
  state.isSendingEmail = true;

  try {
    const response = await fetch(`${API_BASE_URL}/payment/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uuid: state.currentUuid,
        email: state.email,
      }),
    });
  } catch (error) {
    console.log("Failed to send notification email:", error);
  } finally {
    state.isSendingEmail = false;
    state.showModal = false;
    navigateTo("login");
  }
};

const clearError = (field) => {
  state.errors[field] = "";
};

const paymentSend = (uuid) => {
  if (uuid && uuid !== state.currentUuid) {
    state.isLoaded = false;
    state.error = null;
    state.showModal = false;
    state.currentUuid = uuid;
    fetchDetails(uuid);
  }

  return html`
    <div class="payment-send-wrapper">
      ${() => {
        if (state.error) {
          return html`<div class="status-msg"> ${state.error}</div>`;
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
                  <input
                    type="text"
                    placeholder="Your Name"
                    class="${() => (state.errors.username ? "error" : "")}"
                    @input="${(e) => {
                      state.username = e.target.value;
                      clearError("username");
                    }}"
                  />
                  ${() =>
                    state.errors.username
                      ? html`<span class="error-msg"
                          >${state.errors.username}</span
                        >`
                      : ""}
                </div>

                <div class="field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    class="${() => (state.errors.email ? "error" : "")}"
                    @input="${(e) => {
                      state.email = e.target.value;
                      clearError("email");
                    }}"
                  />
                  ${() =>
                    state.errors.email
                      ? html`<span class="error-msg"
                          >${state.errors.email}</span
                        >`
                      : ""}
                </div>

                <div class="field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="07xx xxx xxx"
                    class="${() => (state.errors.phone ? "error" : "")}"
                    @input="${(e) => {
                      state.phone = e.target.value;
                      clearError("phone");
                    }}"
                  />
                  ${() =>
                    state.errors.phone
                      ? html`<span class="error-msg"
                          >${state.errors.phone}</span
                        >`
                      : ""}
                </div>

                <button
                  type="submit"
                  id="pay-btn"
                  disabled="${() => state.isSubmitting}"
                >
                  ${() =>
                    state.isSubmitting
                      ? "Processing..."
                      : "Select Payment Method"}
                </button>
              </form>
            </div>
          </div>

          ${() =>
            state.showModal
              ? html`
                  <div class="modal-overlay">
                    <div class="modal-content">
                      <h3>Choose Payment Method</h3>
                      <p>
                        Payment recorded. Please send
                        <b>${state.amount} RON</b> using one of the methods
                        below:
                      </p>

                      <div class="modal-options">
                        <div class="option-box">
                          <span class="option-label">Bank Transfer (IBAN)</span>
                          <div class="iban-display">
                            <input
                              type="text"
                              value="${state.iban || "No IBAN provided"}"
                              readonly
                            />
                            <button
                              type="button"
                              class="copy-btn ${state.ibanCopied
                                ? "success"
                                : ""}"
                              @click="${copyIban}"
                            >
                              ${state.ibanCopied ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        </div>

                        <div class="option-box">
                          <span class="option-label">Revolut</span>
                          <button
                            type="button"
                            class="revolut-btn"
                            @click="${openRevolut}"
                          >
                            Pay via Revolut ↗
                          </button>
                        </div>
                      </div>

                      <button
                        class="close-modal-btn"
                        @click="${closeAndFinish}"
                        disabled="${() => state.isSendingEmail}"
                      >
                        ${() =>
                          state.isSendingEmail
                            ? "Notifying..."
                            : "I have sent the money"}
                      </button>
                    </div>
                  </div>
                `
              : ""}
        `;
      }}
    </div>
  `;
};

export default paymentSend;
