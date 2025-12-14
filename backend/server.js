import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database.js';
import { swaggerMiddleware } from './config/swagger.js';

import apiRouter from './routes/index.js';
import typeDefs from './graphql/schemas/index.js';
import resolvers from './graphql/resolvers/index.js';
import { buildContext } from './graphql/context.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ApolloServer } from 'apollo-server-express';

import helmet from 'helmet';
import xssClean from 'xss-clean';

import {
    sanitizeMongoPayload,
    rejectNoSqlOperators,
    sanitizeXssPayload,
} from './middleware/security.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function startServer() {
    const app = express();
    app.disable('etag');
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
    });

    // Middlewares globaux
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev'));

    app.use(helmet());
    app.use(express.json({ limit: '10kb' }));
    app.use(rejectNoSqlOperators);
    app.use(sanitizeMongoPayload);
    app.use(sanitizeXssPayload);
    app.use(xssClean());

    connectDatabase();

    swaggerMiddleware(app);

    app.use('/api', apiRouter);

    app.get('/health', (req, res) => {
        res.json({ status: 'ok', message: 'API e-commerce 2025 opérationnelle.' });
    });

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => buildContext({ req }),
        introspection: true,
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    console.log(`🚀 GraphQL prêt sur http://localhost:${PORT}/graphql`);

    app.use('/api', (req, res) => {
        res.status(404).json({ message: 'Ressource non trouvée' });
    });

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`✔ Backend REST : http://localhost:${PORT}/api`);
        console.log(`✔ Backend GraphQL : http://localhost:${PORT}/graphql`);
    });
}

startServer().catch((err) => {
    console.error('Erreur serveur :', err);
    process.exit(1);
});
