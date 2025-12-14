import {Product } from '../../models/Product.model.js';

import { stockResolvers } from './stock.resolvers.js';
import { paymentResolvers } from './payment.resolvers.js';
import { reviewResolvers } from './review.resolvers.js';

export default {
    Query: {
        products: () => Product.find(),
        product: (_, { id }) => Product.findById(id),

        ...(stockResolvers.Query || {}),
        ...(paymentResolvers.Query || {}),
        ...(reviewResolvers.Query || {}),
    },

    Mutation: {
        ...(stockResolvers.Mutation || {}),
        ...(paymentResolvers.Mutation || {}),
        ...(reviewResolvers.Mutation || {}),
    },
};
