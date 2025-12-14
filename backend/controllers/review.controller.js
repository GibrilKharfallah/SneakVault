import { Review } from '../models/Review.model.js';

/**
 * GET /api/reviews/product/:productId
 * Récupère les avis d'un produit
 */
export const getReviewsForProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const reviews = await Review.find({ product: productId })
            .populate("user", "_id email role")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        console.error('Erreur getReviewsForProduct:', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


/**
 * POST /api/reviews/product/:productId
 * Ajoute un avis (user authentifié)
 */
export const addReview = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { rating, comment } = req.body;

        const review = await Review.create({
            product: productId,
            user: req.user.id,
            rating,
            comment: comment || '',
        });

        res.status(201).json(review);
    } catch (err) {
        console.error('Erreur addReview:', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


/**
 * DELETE /api/reviews/:id
 * Supprime un avis — uniquement si l’utilisateur est propriétaire
 */
export const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        const deleted = await Review.findOneAndDelete({
            _id: reviewId,
            user: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({ message: "Avis introuvable ou non autorisé." });
        }

        res.status(200).json({ message: "Avis supprimé avec succès." });
    } catch (err) {
        console.error("Erreur deleteReview:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};


/**
 * DELETE /api/reviews/admin/:id
 * Supprime n’importe quel avis (ADMIN)
 */
export const adminDeleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        const deleted = await Review.findByIdAndDelete(reviewId);

        if (!deleted) {
            return res.status(404).json({ message: "Avis introuvable." });
        }

        res.status(200).json({ message: "Avis supprimé par l'admin." });
    } catch (err) {
        console.error("Erreur adminDeleteReview:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
