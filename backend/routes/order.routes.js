import express from "express";
import { authRequired } from "../middleware/auth.middleware.js";
import {
    createOrderFromCart,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", authRequired, createOrderFromCart);

router.get("/me", authRequired, getUserOrders);

router.get("/:orderId", authRequired, getOrderById);

router.put("/:orderId/status", authRequired, updateOrderStatus);

export default router;
