import { Product } from '../models/Product.model.js';
import { User } from '../models/User.model.js';
import { Order } from '../models/Order.model.js';

/**
 * GET /api/admin/stats
 * Stats globales pour le dashboard
 */
export const getAdminStats = async (req, res) => {
    try {
        const [productsCount, usersCount, ordersCount] = await Promise.all([
            Product.countDocuments(),
            User.countDocuments(),
            Order.countDocuments(),
        ]);

        const paidOrders = await Order.find({
            status: { $in: ['PAID', 'DELIVERED'] },
        });

        const totalRevenue = paidOrders.reduce(
            (sum, o) => sum + (o.totalAmount || 0),
            0
        );

        const lowStockProducts = await Product.find({ stock: { $lt: 5 } })
            .sort({ stock: 1 })
            .limit(5);

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'email')
            .populate('items.product', 'name');

        res.json({
            productsCount,
            usersCount,
            ordersCount,
            totalRevenue,
            lowStockProducts,
            recentOrders,
        });
    } catch (err) {
        console.error('Erreur getAdminStats:', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

/**
 * GET /api/admin/products
 * Liste tous les produits
 */
export const getAllProductsAdmin = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error('Erreur getAllProductsAdmin:', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

/**
 * POST /api/admin/products
 * Crée un produit
 */
export const createProductAdmin = async (req, res) => {
    try {
        const { name, brand, category, description, price, image, stock, isActive } =
            req.body;

        const product = await Product.create({
            name,
            brand,
            category,
            description,
            price,
            image,
            stock,
            isActive: isActive ?? true,
        });

        res.status(201).json(product);
    } catch (err) {
        console.error('Erreur createProductAdmin:', err);
        res.status(400).json({
            message: 'Erreur lors de la création du produit',
            error: err.message,
        });
    }
};

/**
 * PUT /api/admin/products/:id
 * Met à jour un produit
 */
export const updateProductAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;

        const product = await Product.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        res.json(product);
    } catch (err) {
        console.error('Erreur updateProductAdmin:', err);
        res.status(400).json({
            message: 'Erreur lors de la mise à jour du produit',
            error: err.message,
        });
    }
};

/**
 * DELETE /api/admin/products/:id
 * Suppression logique : isActive = false
 */
export const deleteProductAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        res.json({
            message: 'Produit désactivé (suppression logique)',
            product,
        });
    } catch (err) {
        console.error('Erreur deleteProductAdmin:', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

/**
 * GET /api/admin/users
 * Liste tous les utilisateurs
 */
export const getAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error('Erreur getAllUsersAdmin:', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

/**
 * PATCH /api/admin/users/:id/role
 * Change le rôle d'un utilisateur
 */
export const updateUserRoleAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['USER', 'ADMIN'].includes(role)) {
            return res
                .status(400)
                .json({ message: "Rôle invalide. Utilise 'USER' ou 'ADMIN'." });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(user);
    } catch (err) {
        console.error('Erreur updateUserRoleAdmin:', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

/**
 * GET /api/admin/orders
 * Liste toutes les commandes
 */
export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'email')
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error('Erreur getAllOrdersAdmin:', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

/**
 * PATCH /api/admin/orders/:id/status
 * Met à jour le statut d'une commande
 */
export const updateOrderStatusAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        res.json(order);
    } catch (err) {
        console.error('Erreur updateOrderStatusAdmin:', err);
        res.status(400).json({
            message: 'Erreur lors de la mise à jour de la commande',
            error: err.message,
        });
    }
};
