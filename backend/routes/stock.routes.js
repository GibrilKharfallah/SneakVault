import express from 'express';
import { getStock, updateStock } from '../controllers/stock.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stocks
 *   description: Gestion des stocks des produits
 */

/**
 * @swagger
 * /api/stocks/{productId}:
 *   get:
 *     summary: Récupère le stock d'un produit
 *     tags: [Stocks]
 */
router.get('/:productId', getStock);

/**
 * @swagger
 * /api/stocks/{productId}:
 *   put:
 *     summary: Met à jour le stock d'un produit
 *     tags: [Stocks]
 */
router.put(
    '/:productId',
    authRequired,
    validateBody(['quantity']),
    updateStock
);

export default router;
