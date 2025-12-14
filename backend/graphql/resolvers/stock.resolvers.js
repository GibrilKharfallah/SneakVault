import * as stockService from '../../services/stock.service.js';
import { requireAuth, requireRole } from '../directives.js';

export const stockResolvers = {
    Query: {
        stock: async (_, { productId }) => {
        return stockService.getStock(productId);
        },
    },
    Mutation: {
        updateStock: requireRole('ADMIN')(async (_, { productId, quantity }, ctx) => {
        return stockService.updateStock(productId, quantity, ctx.user);
        }),
    },
};
