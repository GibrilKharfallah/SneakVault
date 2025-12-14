import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";

import { authRequired, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupère la liste des produits
 *     tags: [Products]
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupère un produit par son ID
 *     tags: [Products]
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crée un nouveau produit (ADMIN uniquement)
 *     tags: [Products]
 */
router.post("/", authRequired, adminOnly, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Met à jour un produit (ADMIN uniquement)
 *     tags: [Products]
 */
router.put("/:id", authRequired, adminOnly, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprime un produit (ADMIN uniquement)
 *     tags: [Products]
 */
router.delete("/:id", authRequired, adminOnly, deleteProduct);

export default router;
