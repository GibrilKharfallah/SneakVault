import { Order } from '../models/Order.model.js';
import { Product } from '../models/Product.model.js';

/**
 * Recommandations basées sur l'historique d'achat.
 * Idée simple :
 * - on regarde les produits que l'utilisateur a déjà achetés
 * - on recommande les produits populaires que l'utilisateur n'a pas encore achetés
 */
export async function getRecommendationsForUser(userId, limit = 10) {
    const orders = await Order.find({ user: userId });

    const purchasedIds = new Set();
    for (const order of orders) {
        for (const item of order.items) {
            purchasedIds.add(item.product.toString());
        }
    }

    const agg = await Order.aggregate([
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.product',
                totalQuantity: { $sum: '$items.quantity' },
            },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: limit * 2 },
    ]);

    const popularIds = agg.map((a) => a._id);
    const products = await Product.find({
        _id: { $in: popularIds },
        isActive: true,
    });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const recommendations = [];
    for (const a of agg) {
        const id = a._id.toString();
        if (!purchasedIds.has(id)) {
            const p = productMap.get(id);
            if (p) {
                recommendations.push({
                    product: p,
                    totalQuantity: a.totalQuantity,
                });
            }
        }
        if (recommendations.length >= limit) break;
    }

    return recommendations;
}
