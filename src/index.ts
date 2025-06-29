import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./infrasturcture/config/swaggerConfig";
import cityRouter from "./apps/routers/city.route";
import errorMiddleware from "./middleware/error.middleware";
import Logger from "./apps/utils/logger.utils";
import { SERVER_CONSTANTS } from "./infrasturcture/constants/city.contstants";

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
