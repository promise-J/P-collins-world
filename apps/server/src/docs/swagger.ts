// src/docs/swagger.ts
import swaggerJsDoc from "swagger-jsdoc";

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? './dist' : './src';

export const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "P Collins API",
      version: "1.0.0"
    }
  },
  apis: [
    `${basePath}/**/*.js`,
    `${basePath}/**/*.ts`
  ]
});