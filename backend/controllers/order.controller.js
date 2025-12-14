import { Order } from "../models/Order.model.js";
import Cart from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js";
import { Delivery } from "../models/Delivery.model.js";

/**
 *  CRÉER UNE COMMANDE DEPUIS LE PANIER
 */
export const createOrderFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Votre panier est vide." });
        }

        let orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);

            if (!product || !product.isActive) {
                return res.status(400).json({
                    message: `Le produit ${item.product.name} n'est plus disponible.`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Stock insuffisant pour ${product.name}. Stock actuel : ${product.stock}`,
                });
            }

            const unitPrice = product.price;
            const totalPrice = unitPrice * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                unitPrice,
                totalPrice,
            });

            totalAmount += totalPrice;
        }

        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            product.stock -= item.quantity;
            await product.save();
        }

        const newOrder = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,
            status: "PENDING",
        });

        const delivery = await Delivery.create({
            order: newOrder._id,
            user: userId,
            status: "PENDING",
            trackingNumber: `TRK-${Date.now()}`,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2 || "",
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country || "France",
        });

        cart.items = [];
        await cart.save();

        return res.status(201).json({
            message: "Commande créée avec succès.",
            order: newOrder,
            delivery,
        });
    } catch (error) {
        console.error("Erreur createOrderFromCart:", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

/**
 *  COMMANDES UTILISATEUR + livraisons associées
 */
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ user: userId })
            .populate("items.product")
            .sort({ createdAt: -1 })
            .lean();

        const deliveries = await Delivery.find({ user: userId }).lean();

        const mapDeliveries = new Map(
            deliveries.map((d) => [d.order.toString(), d])
        );

        const enrichedOrders = orders.map((order) => ({
            ...order,
            delivery: mapDeliveries.get(order._id.toString()) || null,
        }));

        res.json(enrichedOrders);
    } catch (error) {
        console.error("Erreur getUserOrders:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 *  DÉTAIL D'UNE COMMANDE
 */
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user.id,
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({ message: "Commande introuvable." });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 *  MODIFIER STATUT
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status: req.body.status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 *  ANNULER UNE COMMANDE
 */
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        order.status = "CANCELLED";
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
