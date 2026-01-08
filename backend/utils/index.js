const { generateUUID } = require("./uuid");
const { sendPaymentNotificationEmail } = require("./mail");

module.exports = {
  generateUUID,
  sendPaymentNotificationEmail,
};
