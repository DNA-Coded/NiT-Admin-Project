import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger.options.js';

// Compile the Swagger JSON spec based on the options and scanned JSDoc comments
const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
