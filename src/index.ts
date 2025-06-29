import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./infrasturcture/config/swaggerConfig";
import cityRouter from "./apps/routers/city.route";
import errorMiddleware from "./middleware/error.middleware";
import Logger from "./apps/utils/logger.utils";

/**
 * Connects to the MongoDB database using the provided URI.
 * Ensures that the database connection is established before proceeding with the server setup.
 * Logs success or error messages accordingly
 * @async
 * @function
 * @returns {Promise<void>} Resolves if the connection is successful, rejects otherwise.
 */
const connectToDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI;
    //console.log("MONGODB_URI-------------:", MONGODB_URI); // Debugging line to check the URI
    if (!MONGODB_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    //Logger.info(`Attempting to connect to MongoDB with URI: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI, {
      // Optional for Mongoose 7, but included for compatibility
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    Logger.info("Connected to MongoDB");
  } catch (error) {
    Logger.error("MongoDB connection error:", error);
    throw error;
  }
};

/**
 * Express application instance.
 * @constant {object}
 */
const app = express();

/**
 * Port number for the server.
 * @constant {number}
 */
const port = process.env.PORT || 3000;

// Log environment variables for debugging
Logger.info(`Environment variables - PORT: ${process.env.PORT}, MONGO_URI: ${process.env.MONGO_URI}`);

// Connect to the database before starting the server
connectToDatabase();

// Middleware setup
/**
 * Middleware to parse JSON data in incoming requests.
 * @function
 */
app.use(express.json());

/**
 * Setup Swagger UI for API documentation.
 * Serves Swagger UI at the specified base URL and provides the generated specifications.
 * @function
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
Logger.info(`Swagger UI available at http://localhost:${port}/api-docs`);

/**
 * Root route to check if the server is running.
 * Logs a message indicating the server is active.
 * @function
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 */
app.get("/", (req, res) => {
  res.send("City Management API is running");
  Logger.info("City Management API is running");
});

/**
 * Route for city-related endpoints.
 * Logs a message when the route is set.
 * @function
 */
app.use("/api/cities", cityRouter);
Logger.info("API cities Route set: /api/cities");

// Global error handler
app.use(errorMiddleware);

/**
 * Start the HTTP server and listen on the specified port.
 * Logs the server's URL on successful startup.
 * @function
 */
const server = http.createServer(app);

server.listen(port, () => {
  Logger.info(`Server running at http://localhost:${port}`);
});

/**
 * Export the Express application instance.
 * @module
 */
export default app;