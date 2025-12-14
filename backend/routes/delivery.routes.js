import express from "express";
import {
    getAllDeliveries,
    getDeliveryByOrder,
    getDeliveryById,
    updateDeliveryStatus,
} from "../controllers/delivery.controller.js";

import { authRequired, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: Gestion des livraisons
 */

/**
 * GET /api/deliveries
 * → Liste de TOUTES les livraisons (ADMIN)
 */
router.get("/", authRequired, requireRole("ADMIN"), getAllDeliveries);

/**
 * GET /api/deliveries/order/{orderId}
 * → Livraison liée à une commande (USER)
 */
router.get("/order/:orderId", authRequired, getDeliveryByOrder);

/**
 * GET /api/deliveries/{id}
 * → Récupération par id (optionnel côté user)
 */
router.get("/:id", authRequired, getDeliveryById);

/**
 * PATCH /api/deliveries/{id}/status
 * → Mise à jour du statut (ADMIN)
 */
router.patch("/:id/status", authRequired, requireRole("ADMIN"), updateDeliveryStatus);

export default router;
