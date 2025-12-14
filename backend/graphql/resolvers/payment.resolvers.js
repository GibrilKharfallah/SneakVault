import * as paymentService from '../../services/payment.service.js';
import { requireAuth } from '../directives.js';

export const paymentResolvers = {
    Query: {
        payment: requireAuth(async (_, { id }, ctx) => {
        return paymentService.getPaymentById(id, ctx.user);
        }),
    },
    Mutation: {
        createPayment: requireAuth(async (_, { input }, ctx) => {
        return paymentService.createPayment(input, ctx.user);
        }),
    },
};
