import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import { typeDefs } from './schemas/index.js';
import { resolvers } from './resolvers/index.js';
import { authGraphQL } from './middleware/auth.middleware.js';
import { rateLimitGraphQL } from './middleware/rateLimit.js';

export default async function initGraphQL(app) {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    app.use(
        '/graphql',
        bodyParser.json(),
        authGraphQL,
        rateLimitGraphQL,
        expressMiddleware(server)
    );

    console.log('🚀 GraphQL prêt sur /graphql');
}
