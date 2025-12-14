import * as reviewService from '../../services/review.service.js';
import { requireAuth } from '../directives.js';

export const reviewResolvers = {
    Query: {
        reviews: async (_, { productId }) => {
        return reviewService.getReviewsForProduct(productId);
        },
    },
    Mutation: {
        addReview: requireAuth(async (_, { input }, ctx) => {
        return reviewService.addReview(input, ctx.user);
        }),
        deleteReview: requireAuth(async (_, { id }, ctx) => {
        await reviewService.deleteReview(id, ctx.user);
        return true;
        }),
    },
};
