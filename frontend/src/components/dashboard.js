import { html, reactive } from "@arrow-js/core";
import { appState, navigateTo, API_BASE_URL } from "../app/app.js";
import { toDataURL } from "qrcode";
import "../styles/dashboard.css";

const dashboardData = reactive({
  history: [],
  loading: false,
  selectedPayment: null,
});

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert("Link copiat!");
  });
};

const getHistory = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;
  dashboardData.loading = true;
  try {
    const response = await fetch(`${API_BASE_URL}/payment/getHistory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      dashboardData.history = Array.isArray(data) ? data : data.history || [];
    }
  } catch (error) {
    console.error(error);
  } finally {
    dashboardData.loading = false;
  }
};

const refreshQRCode = async () => {
  const token = localStorage.getItem('authToken'); 
  const image = document.getElementById("qrCodeImage");

  if (!token || !image) return;

  try {
    const response = await fetch(`${API_BASE_URL}/payment/getPaymentQR`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Eroare Backend");

    const data = await response.json();
    
    if (data.url) {
      const dataURL = await toDataURL(data.url, { 
        width: 250, 
        margin: 2 
      });
      image.src = dataURL;
    }
  }catch (err) {
    console.error("Eroare la generare:", err);
  }
};

const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  appState.authToken = null;
  appState.isAuthenticated = false;
  navigateTo("login");
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleString("ro-RO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

const dashboard = html`
  <div class="dashboard-pane">
    ${() =>
      dashboardData.selectedPayment
        ? html`
            <div
              class="modal-overlay"
              @click="${() => (dashboardData.selectedPayment = null)}"
            >
              <div
                class="modal-content longer-modal"
                @click="${(e) => e.stopPropagation()}"
              >
                <div class="modal-header">
                  <h3>Payment Details</h3>
                  <div class="close-modal-container">
                    <button
                      class="close-modal"
                      @click="${() => (dashboardData.selectedPayment = null)}"
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                </div>
                <div class="modal-body">
                  <div class="detail-row">
                    <span>Payment Link</span>
                    <div class="copy-container">
                      <div class="link-box">
                        <small
                          >${window.location.origin}/pay/${dashboardData
                            .selectedPayment.UUID}</small
                        >
                      </div>
                      <button
                        class="copy-btn"
                        @click="${() =>
                          copyToClipboard(
                            `${window.location.origin}/pay/${dashboardData.selectedPayment.UUID}`
                          )}"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div class="modal-grid">
                    <div class="detail-row">
                      <span>Amount</span>
                      <strong
                        >${dashboardData.selectedPayment.amount} RON</strong
                      >
                    </div>
                    <div class="detail-row">
                      <span>Status</span>
                      <strong
                        class="status-badge ${dashboardData.selectedPayment
                          .status}"
                        >${dashboardData.selectedPayment.status}</strong
                      >
                    </div>
                  </div>
                  <div class="detail-row">
                    <span>Description</span>
                    <p class="desc-text">
                      ${dashboardData.selectedPayment.description ||
                      "No description"}
                    </p>
                  </div>
                  <div class="modal-grid">
                    <div class="detail-row">
                      <span>People</span>
                      <strong
                        >👥 ${dashboardData.selectedPayment.peopleNo}</strong
                      >
                    </div>
                    <div class="detail-row">
                      <span>Date</span>
                      <strong
                        >${formatDate(
                          dashboardData.selectedPayment.createdAt
                        )}</strong
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `
        : ""}

    <div class="top-bar">
      <button id="profile" @click="${() => navigateTo("profile")}">
        👤 Profile
      </button>
      <h2 id="title">Dashboard</h2>
      <div class="spacer"></div>
    </div>

    <div class="dashboard-content">
      <div class="account">
        <div class="account-header">
          <h3>Payments history</h3>
          <button class="refresh-btn" @click="${getHistory}">↻</button>
        </div>
        <div class="history-list">
          ${() =>
            dashboardData.history.map(
              (item) => html`
                <div
                  class="payment-card"
                  @click="${() => (dashboardData.selectedPayment = item)}"
                >
                  <div class="card-header">
                    <span class="amount">${item.amount} RON</span>
                    <span class="status ${item.status?.toLowerCase()}"
                      >${item.status?.replace("_", " ")}</span
                    >
                  </div>
                  <div class="card-body">
                    <p class="details">
                      ${item.description || "No description"}
                    </p>
                    <div class="card-footer">
                      <span class="people">👥 ${item.peopleNo} pers.</span>
                      <span class="date">${formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              `
            )}
        </div>
      </div>

      <div class="qr-content">
        <h2 id="qr-title">Scan me to receive money</h2>
        <div class="qr-container">
          <div class="qr"><img id="qrCodeImage" /></div>
        </div>
        <button id="qr-button" @click="${refreshQRCode}">REFRESH QR</button>
      </div>
    </div>

    <div class="bottom-bar">
      <button id="request" @click="${() => navigateTo("paymentRequest")}">
        +
      </button>
      <button id="logout" @click="${handleLogout}">Logout</button>
    </div>
  </div>
`;

getHistory();
setTimeout(refreshQRCode, 50);

export default dashboard;
