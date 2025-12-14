import { Product } from "../models/Product.model.js";

/**
 * GET /api/products
 * Récupère tous les produits
 */
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // éventuellement .find({ isActive: true })
        res.json(products);
    } catch (err) {
        console.error("Erreur getAllProducts:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * GET /api/products/:id
 * Récupère un produit par son ID
 */
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.json(product);
    } catch (err) {
        console.error("Erreur getProductById:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * POST /api/products
 * Crée un produit
 */
export const createProduct = async (req, res) => {
    try {
        let {
            name,
            description,
            price,
            stock,
            stockQuantity,
            isActive,
            image,
            brand,
            category,
        } = req.body;

        if (stock == null && stockQuantity != null) {
            stock = stockQuantity;
        }

        if (!name || price == null) {
            return res
                .status(400)
                .json({ message: "Nom et prix sont obligatoires" });
        }

        const product = await Product.create({
            name,
            description: description || "",
            price,
            stock: stock ?? 0,
            isActive: isActive ?? true,
            image: image || "",
            brand: brand || "",
            category: category || "",
        });

        res.status(201).json(product);
    } catch (err) {
        console.error("Erreur createProduct:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * PUT /api/products/:id
 * Met à jour un produit
 */
export const updateProduct = async (req, res) => {
    try {
        const updates = { ...req.body };

        if (updates.stock == null && updates.stockQuantity != null) {
            updates.stock = updates.stockQuantity;
            delete updates.stockQuantity;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        res.json(product);
    } catch (err) {
        console.error("Erreur updateProduct:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * DELETE /api/products/:id
 * Supprime un produit
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Erreur deleteProduct:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
