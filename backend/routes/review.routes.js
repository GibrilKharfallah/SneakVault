import express from 'express';

import {
    getReviewsForProduct,
    addReview,
    deleteReview,
    adminDeleteReview,
} from '../controllers/review.controller.js';

import { authRequired, requireRole } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';

const router = express.Router();

/* Récupérer les avis d’un produit */
router.get('/product/:productId', getReviewsForProduct);

/* Ajouter un avis */
router.post(
    '/product/:productId',
    authRequired,
    validateBody(['rating', 'comment']),
    addReview
);

/* Supprimer SON propre avis */
router.delete('/:id', authRequired, deleteReview);

/* ADMIN : supprimer n'importe quel avis */
router.delete('/admin/:id', authRequired, requireRole("ADMIN"), adminDeleteReview);

export default router;
