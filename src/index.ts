import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./infrasturcture/config/swaggerConfig";
import cityRouter from "./apps/routers/city.route";
import errorMiddleware from "./middleware/error.middleware";
import Logger from "./apps/utils/logger.utils";
import cors from "cors";
import { SERVER_CONSTANTS, SWAGGER, CORS_CONSTANTS } from "./infrasturcture/constants/city.contstants";

const connectToDatabase = async () => {
  try {
    const MONGODB_URI = process.env[SERVER_CONSTANTS.ENV.MONGO_URI];
    if (!MONGODB_URI) {
      throw new Error(SERVER_CONSTANTS.ERRORS.MONGO_URI_UNDEFINED);
    }
    await mongoose.connect(MONGODB_URI);
    Logger.info(SERVER_CONSTANTS.LOGS.MONGO_CONNECTED);
  } catch (error) {
    Logger.error(SERVER_CONSTANTS.LOGS.MONGO_CONNECTION_ERROR, error);
    throw error;
  }
};

const app = express();
const port = process.env[SERVER_CONSTANTS.ENV.PORT] || SERVER_CONSTANTS.DEFAULTS.PORT;
const localhostURL = `${SERVER_CONSTANTS.DEFAULTS.HOST}:${port}`;
connectToDatabase();
// Configure CORS to allow specific origins
const allowedOrigins = [
  `${SERVER_CONSTANTS.DEFAULTS.PROTOCOL}://${SERVER_CONSTANTS.DEFAULTS.HOST}:${port}`,
  SWAGGER.PRODUCTION_URL
];

interface CorsOriginCallback {
  (err: Error | null, allow?: boolean): void;
}

interface CorsOptions {
  origin: (origin: string | undefined, callback: CorsOriginCallback) => void;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

app.use(
  cors({
    origin: (origin: string | undefined, callback: CorsOriginCallback): void => {
      // Allow requests with no origin (e.g., Postman, curl) or from allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(CORS_CONSTANTS.CORS_ERROR));
      }
    },
    methods: [
      CORS_CONSTANTS.METHODS.GET,
      CORS_CONSTANTS.METHODS.POST,
      CORS_CONSTANTS.METHODS.PUT,
      CORS_CONSTANTS.METHODS.DELETE,
      CORS_CONSTANTS.METHODS.OPTIONS
    ],
    allowedHeaders: [
      CORS_CONSTANTS.HEADERS.CONTENT_TYPE,
      CORS_CONSTANTS.HEADERS.AUTHORIZATION
    ],
    credentials: true
  } as CorsOptions)
);

app.use(express.json());

app.use(
  SERVER_CONSTANTS.ROUTES.API_DOCS,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs)
);
Logger.info(`${SERVER_CONSTANTS.LOGS.SWAGGER_AVAILABLE} ${SERVER_CONSTANTS.DEFAULTS.PROTOCOL}://${localhostURL}${SERVER_CONSTANTS.ROUTES.API_DOCS}`);

app.get(SERVER_CONSTANTS.ROUTES.ROOT, (req, res) => {
  res.send(SERVER_CONSTANTS.MESSAGES.API_RUNNING);
  Logger.info(SERVER_CONSTANTS.LOGS.API_RUNNING);
});

app.use(SERVER_CONSTANTS.ROUTES.CITIES, cityRouter);
Logger.info(`${SERVER_CONSTANTS.LOGS.CITY_ROUTE} ${SERVER_CONSTANTS.ROUTES.CITIES}`);

app.use(errorMiddleware);

const server = http.createServer(app);
server.listen(port, () => {
  Logger.info(`${SERVER_CONSTANTS.LOGS.SERVER_RUNNING} ${SERVER_CONSTANTS.DEFAULTS.PROTOCOL}://${localhostURL}`);
});

export default app;