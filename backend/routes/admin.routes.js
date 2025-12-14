import express from 'express';
import { authRequired, requireRole } from '../middleware/auth.middleware.js';
import {
    getAdminStats,
    getAllProductsAdmin,
    createProductAdmin,
    updateProductAdmin,
    deleteProductAdmin,
    getAllUsersAdmin,
    updateUserRoleAdmin,
    getAllOrdersAdmin,
    updateOrderStatusAdmin,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authRequired, requireRole('ADMIN'));

//  Dashboard global
router.get('/stats', getAdminStats);

//  Produits
router.get('/products', getAllProductsAdmin);
router.post('/products', createProductAdmin);
router.put('/products/:id', updateProductAdmin);
router.delete('/products/:id', deleteProductAdmin);

//  Utilisateurs
router.get('/users', getAllUsersAdmin);
router.patch('/users/:id/role', updateUserRoleAdmin);

//  Commandes
router.get('/orders', getAllOrdersAdmin);
router.patch('/orders/:id/status', updateOrderStatusAdmin);

export default router;
