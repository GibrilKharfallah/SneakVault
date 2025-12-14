import { Payment } from "../models/Payment.model.js";
import { Order } from "../models/Order.model.js";
import { processPaymentMock } from "../services/payment.service.js";
import { sendPaymentConfirmationEmail } from "../services/email.service.js";

const BILLING_FIELDS = ["addressLine1", "city", "postalCode"];

/**
 * POST /api/payments
 * Crée un paiement mocké pour une commande
 */
export const createPayment = async (req, res) => {
    try {
        const {
            orderId,
            method,
            amount,
            cardNumber,
            expiryMonth,
            expiryYear,
            cvc,
            billingAddress = {},
        } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "orderId est requis." });
        }

        const sanitizedCard = String(cardNumber || "");
        const sanitizedCvc = String(cvc || "");
        const month = Number(expiryMonth);
        const year = Number(expiryYear);

        if (!/^\d{16}$/.test(sanitizedCard)) {
            return res
                .status(400)
                .json({ message: "Numéro de carte invalide (16 chiffres)." });
        }
        if (!/^\d{3}$/.test(sanitizedCvc)) {
            return res.status(400).json({ message: "CVC invalide (3 chiffres)." });
        }
        if (!Number.isInteger(month) || month < 1 || month > 12) {
            return res.status(400).json({ message: "Mois d'expiration invalide." });
        }
        if (!/^\d{4}$/.test(String(expiryYear))) {
            return res.status(400).json({ message: "Année d'expiration invalide." });
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return res.status(400).json({ message: "La carte est expirée." });
        }

        for (const field of BILLING_FIELDS) {
            if (!billingAddress[field]) {
                return res
                    .status(400)
                    .json({ message: `Champ de facturation manquant: ${field}` });
            }
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        if (order.user.toString() !== req.user.id && req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ message: "Accès interdit pour cette commande" });
        }

        const payment = await Payment.create({
            order: order._id,
            user: order.user,
            amount: amount ?? order.totalAmount,
            method: method || "CARD",
            status: "PENDING",
            cardLast4: sanitizedCard.slice(-4),
            billingAddress: {
                addressLine1: billingAddress.addressLine1,
                addressLine2: billingAddress.addressLine2 || "",
                city: billingAddress.city,
                postalCode: billingAddress.postalCode,
            },
        });

        const result = await processPaymentMock(payment);

        payment.status = result.success ? "SUCCESS" : "FAILED";
        if (result.transactionRef) {
            payment.transactionRef = result.transactionRef;
        }
        await payment.save();

        if (result.success) {
            order.status = "PAID";
            await order.save();

            try {
                await sendPaymentConfirmationEmail({
                    userId: order.user.toString(),
                    order,
                    payment,
                });
            } catch (e) {
                console.error("Erreur lors de lenvoi du mail de paiement:", e);
            }
        }

        res.status(201).json(payment);
    } catch (err) {
        console.error("Erreur createPayment:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * GET /api/payments/:id
 * Récupère le détail d'un paiement
 */
export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate("order");
        if (!payment) {
            return res.status(404).json({ message: "Paiement non trouvé" });
        }

        if (
            payment.user.toString() !== req.user.id &&
            req.user.role !== "ADMIN"
        ) {
            return res
                .status(403)
                .json({ message: "Accès interdit à ce paiement" });
        }

        res.json(payment);
    } catch (err) {
        console.error("Erreur getPaymentById:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * GET /api/payments/me
 * Liste les paiements de l'utilisateur connecté
 */
export const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id })
            .populate("order")
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (err) {
        console.error("Erreur getMyPayments:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
