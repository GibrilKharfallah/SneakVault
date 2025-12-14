import express from "express";
import {
    createPayment,
    getPaymentById,
    getMyPayments,
} from "../controllers/payment.controller.js";
import { authRequired } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";
import { paymentRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post(
    "/",
    authRequired,
    paymentRateLimit,
    validateBody([
        "orderId",
        "amount",
        "method",
        "cardNumber",
        "expiryMonth",
        "expiryYear",
        "cvc",
        "billingAddress",
    ]),
    createPayment
);

router.get("/me", authRequired, getMyPayments);

router.get("/:id", authRequired, getPaymentById);

export default router;
