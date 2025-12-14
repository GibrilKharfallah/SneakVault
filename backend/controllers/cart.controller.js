import Cart from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js";

/* ---------------------------------------------
    Récupérer le panier de l'utilisateur
--------------------------------------------- */
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

/* ---------------------------------------------
    Ajouter un produit dans le panier
    Vérifie le stock
--------------------------------------------- */
export const addItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Produit introuvable" });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Stock insuffisant. Il reste seulement ${product.stock} unités.`,
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity }],
            });
            return res.json(cart);
        }

        const index = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (index !== -1) {
            const newQuantity = cart.items[index].quantity + quantity;

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: `Impossible d'ajouter ${quantity} unités : stock restant ${product.stock}.`,
                });
            }

            cart.items[index].quantity = newQuantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

/* ---------------------------------------------
    Modifier la quantité d'un produit
    Vérifie aussi le stock
--------------------------------------------- */
export const updateItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) return res.status(404).json({ message: "Panier introuvable" });

        const item = cart.items.id(itemId);
        if (!item) return res.status(404).json({ message: "Article introuvable" });

        const product = await Product.findById(item.product);

        if (!product) {
            return res.status(404).json({ message: "Produit introuvable" });
        }

        //  Vérification stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Impossible de mettre ${quantity} unités : stock restant ${product.stock}.`,
            });
        }

        item.quantity = quantity;
        await cart.save();

        const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

/* ---------------------------------------------
    Retirer un produit du panier
--------------------------------------------- */
export const removeItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Panier introuvable" });

        cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

        await cart.save();

        const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

/* ---------------------------------------------
    Vider entièrement le panier
--------------------------------------------- */
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Panier introuvable" });

        cart.items = [];
        await cart.save();

        res.json({ message: "Panier vidé", cart });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
