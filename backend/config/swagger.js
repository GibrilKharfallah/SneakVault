import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SneakVault routes documentation',
      version: '1.0.0',
      description: 'Documentation des API internes du projet SneakVault.',
    },
    servers: [
      {
        url: 'http://localhost:' + (process.env.PORT || 4000),
      },
    ],
  },
  apis: ['./docs/swagger.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

export function swaggerMiddleware(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Documentation Swagger disponible sur /api/docs');
}
