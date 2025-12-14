import express from 'express';
import { getRecommendations } from '../controllers/recommendation.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Recommandations personnalisées de produits
 */

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Récupère des recommandations de produits pour l'utilisateur connecté
 *     tags: [Recommendations]
 */
router.get('/', authRequired, getRecommendations);

export default router;
