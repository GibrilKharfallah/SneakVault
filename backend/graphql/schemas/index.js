import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseTypeDefs = `#graphql
    scalar DateTime

    type Product {
        id: ID!
        name: String!
        description: String
        price: Float!
        stockQuantity: Int!
    }

    type Query {
        products: [Product!]!
        product(id: ID!): Product
    }

    type Mutation
`;

function loadSDL(file) {
    return fs.readFileSync(path.join(__dirname, file), 'utf-8');
}

const stockSDL = loadSDL('stock.graphql');
const paymentSDL = loadSDL('payment.graphql');
const reviewSDL = loadSDL('review.graphql');

const typeDefs = [
    baseTypeDefs,
    stockSDL,
    paymentSDL,
    reviewSDL
].join('\n');

export default typeDefs;
