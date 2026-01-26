const paymentDb = require("../models").paymentModel;
const userDb = require("../models").userModel;
const payerDb = require("../models").payerModel;
const paymentHistoryDb = require("../models").paymentHistoryModel;
const { generateUUID, sendPaymentNotificationEmail } = require("../utils");

const controller = {
  create: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json("Unauthorized");
      }

      const idRequester = req.user.id;
      const newUuid = await generateUUID();

      const newPayment = {
        idRequester,
        UUID: newUuid,
        amount: Number(req.body.amount),
        peopleNo: Number(req.body.peopleNo),
        description: req.body.description,
        expireDate: new Date(req.body.expireDate),
        createdAt: new Date(),
        status: "in_progress",
      };

      const createdPayment = await paymentDb.create(newPayment);
      res.status(201).json({
        message: "Payment created",
        uuid: createdPayment.UUID,
      });
    } catch (err) {
      console.error("PAYMENT CREATE ERROR:", err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  },

  getPaymentDetails: async (req, res) => {
    try {
      const { uuid } = req.params;

      const payment = await paymentDb.findOne({
        where: { UUID: uuid },
        attributes: ["amount", "description", "status"],
        include: [
          {
            model: userDb,
            as: "Requester",
            attributes: ["username", "iban", "revolutLink"],
          },
        ],
      });

      if (!payment) return res.status(404).json("Payment request not found");

      res.status(200).json({
        amount: payment.amount,
        description: payment.description,
        status: payment.status,
        requester: payment.Requester.username,
        iban: payment.Requester.iban,
        revolutLink: payment.Requester.revolutLink,
      });
    } catch (err) {
      console.error("GET DETAILS ERROR:", err);
      res.status(500).json("Server Error!");
    }
  },

  getLastPayment: async (req, res) => {
    try {
      const userId = req.user.id; 

      const lastPayment = await paymentDb.findOne({
        where: { idRequester: userId },
        order: [['createdAt', 'DESC']]
      });

      if (!lastPayment) {
        return res.status(404).json({ message: "Nu a fost găsită nicio plată." });
      }

    const paymentLink = `${process.env.FRONTEND_URL}/pay/${lastPayment.UUID}`;

    res.status(200).json({ url: paymentLink });

    } catch (err) {
      console.error("Error in getLastPayment:", err);
      res.status(500).json("Server Error!");
    }
  },

  getPaymentsHistory: async (req, res) => {
    try {
      const userId = req.user.id;

      const history = await paymentDb.findAll({
        where: { idRequester: userId },
        order: [["id", "DESC"]],
      });

      if (!history || history.length === 0) {
        return res.status(404).json("No payment history found for this user");
      }

      res.status(200).json(history);
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error!");
    }
  },

  update: async (req, res) => {
    try {
      const { uuid, username, phone, email } = req.body;

      const payment = await paymentDb.findOne({ where: { UUID: uuid } });

      if (!payment) {
        return res.status(404).json("This payment link is invalid or expired.");
      }

      const newPayer = await payerDb.create({
        username: username,
        phoneNo: phone,
        email: email,
        idPay: payment.id,
      });

      await paymentHistoryDb.create({
        idPay: payment.id,
        idPayer: newPayer.id,
        status: "pending",
        createdAt: new Date(),
      });

      const count = await paymentHistoryDb.count({
        where: { idPay: payment.id },
      });
      if (count >= payment.peopleNo) {
        await payment.update({ status: "finished" });
      }

      res.status(200).json({ message: "Details saved successfully!" });
    } catch (err) {
      console.error("GUEST PAY ERROR:", err);
      res.status(500).json("Server Error during payment processing");
    }
  },

  notifyPaymentSent: async (req, res) => {
    try {
      const { uuid, email } = req.body;

      console.log("Processing notify for:", email, uuid);

      if (!uuid || !email) {
        return res.status(400).json("UUID and Email are required.");
      }

      const payment = await paymentDb.findOne({ where: { UUID: uuid } });
      if (!payment) {
        return res.status(404).json("Payment link invalid.");
      }

      const user = await userDb.findOne({ where: { id: payment.idRequester } });

      if (!user) {
        console.error("User not found for payment:", payment.id);
        return res.status(404).json("User requester not found.");
      }

      const payer = await payerDb.findOne({
        where: { idPay: payment.id, email: email },
      });

      if (!payer) {
        return res.status(404).json("Guest details not found.");
      }

      let historyEntry = await paymentHistoryDb.findOne({
        where: { idPay: payment.id, idPayer: payer.id },
      });

      if (historyEntry && historyEntry.status === "finished") {
        return res.status(200).json({ message: "Already notified." });
      }

      if (historyEntry) {
        await historyEntry.update({
          status: "finished",
          updatedAt: new Date(),
        });
      } else {
        await paymentHistoryDb.create({
          idPay: payment.id,
          idPayer: payer.id,
          status: "finished",
          createdAt: new Date(),
        });
      }

      await sendPaymentNotificationEmail(
        user.email,
        user.username || "User",
        payer.username || "Guest",
        payment.description
      );

      res.status(200).json({ message: "user notified successfully!" });
    } catch (err) {
      console.error("NOTIFY ERROR:", err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const paymentId = req.params.id;

      const removePayment = await paymentDb.destroy({
        where: {
          id: paymentId,
        },
      });

      res.status(200).json("Payment deleted successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error!");
    }
  },
};

module.exports = controller;
