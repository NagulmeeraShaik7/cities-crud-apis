import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerOptions } from "swagger-ui-express";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "City Management API",
      version: "1.0.0",
      description: "API for managing a collection of cities with CRUD operations, pagination, filtering, sorting, and searching."
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Local server"
      }
    ],
    components: {
      schemas: {
        City: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "Tokyo" },
            population: { type: "number", example: 37400068 },
            country: { type: "string", example: "Japan" },
            latitude: { type: "number", example: 35.6895 },
            longitude: { type: "number", example: 139.6917 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          },
          required: ["name", "population", "country", "latitude", "longitude"]
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                message: { type: "string", example: "Internal Server Error" },
                status: { type: "integer", example: 500 }
              }
            }
          }
        }
      }
    }
  },
  apis: ["./src/apps/routers/*.ts"]
};

const swaggerSpecs: SwaggerOptions = swaggerJsdoc(swaggerOptions);

export default swaggerSpecs;