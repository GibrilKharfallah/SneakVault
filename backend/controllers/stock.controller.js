import { Product } from '../models/Product.model.js';

/**
 * GET /api/stocks/:productId
 * Récupère le stock d'un produit
 */
export const getStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      'stockQuantity'
    );
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json({ productId: product._id, stock: product.stockQuantity });
  } catch (err) {
    console.error('Erreur getStock:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * PUT /api/stocks/:productId
 * Met à jour le stock d'un produit
 */
export const updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      return res.status(400).json({ message: 'Stock invalide' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { stockQuantity: quantity },
      { new: true }
    ).select('stockQuantity');

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({ productId: product._id, stock: product.stockQuantity });
  } catch (err) {
    console.error('Erreur updateStock:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
