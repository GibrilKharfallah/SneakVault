import express from "express";
import { authRequired } from "../middleware/auth.middleware.js";
import {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", authRequired, getCart);
router.post("/", authRequired, addItem);
router.put("/item/:itemId", authRequired, updateItem);
router.delete("/item/:itemId", authRequired, removeItem);
router.delete("/", authRequired, clearCart);

export default router;
