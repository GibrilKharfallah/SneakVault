import express from 'express';
import { getProfile, updateProfile, deleteAccount } from '../controllers/user.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion du profil utilisateur
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupère le profil de l'utilisateur connecté
 *     tags: [Users]
 */
router.get('/me', authRequired, getProfile);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Met à jour le profil de l'utilisateur connecté
 *     tags: [Users]
 */
router.put('/me', authRequired, updateProfile);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Supprime le compte de l'utilisateur connecté
 *     tags: [Users]
 */
router.delete('/me', authRequired, deleteAccount);

export default router;
