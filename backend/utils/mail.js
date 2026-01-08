require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER_EMAIL = process.env.FROM_MAIL || "onboarding@resend.dev";

const sendPaymentNotificationEmail = async (
  toEmail,
  userName,
  guestName,
  paymentDescription
) => {
  try {
    const data = await resend.emails.send({
      from: `Flow Payment <${SENDER_EMAIL}>`,
      to: [toEmail],
      subject: `💰 Payment Sent by ${guestName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Hello, ${userName}!</h2>
          <p>Great news! <strong>${guestName}</strong> has marked the payment as sent.</p>
          
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Payment Details:</strong> ${paymentDescription}</p>
            <p style="margin: 5px 0 0 0; color: #666;">Please check your bank account to verify receipt.</p>
          </div>

          <p style="font-size: 12px; color: #888;">This is an automated notification.</p>
        </div>
      `,
    });

    console.log("Email sent successfully");
    return data;
  } catch (error) {
    console.error("Resend Error:", error);
    return null;
  }
};

module.exports = {
  sendPaymentNotificationEmail,
};
