import { Router } from 'express';

import productRoutes from './product.routes.js';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import orderRoutes from './order.routes.js';
import stockRoutes from './stock.routes.js';
import paymentRoutes from './payment.routes.js';
import reviewRoutes from './review.routes.js';
import deliveryRoutes from './delivery.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import cartRoutes from "./cart.routes.js";
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

router.use('/stocks', stockRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);

router.use('/deliveries', deliveryRoutes);
router.use('/recommendations', recommendationRoutes);
router.use("/cart", cartRoutes);

export default router;





