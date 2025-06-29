import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerOptions } from "swagger-ui-express";
import {
  SWAGGER,
  SCHEMAS,
  CITY_FIELDS,
  ERROR_FIELDS
} from "../constants/city.contstants";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: SWAGGER.OPENAPI_VERSION,
    info: {
      title: SWAGGER.TITLE,
      version: SWAGGER.VERSION,
      description: SWAGGER.DESCRIPTION
    },
    servers: [
      {
        url: `${SWAGGER.PROTOCOL}://${SWAGGER.HOST}:${process.env.PORT || SWAGGER.DEFAULT_PORT}`,
        description: SWAGGER.LOCAL_SERVER_DESCRIPTION
      },
      {
        url: SWAGGER.PRODUCTION_URL,
        description: SWAGGER.PRODUCTION_SERVER_DESCRIPTION
      }
    ],
    components: {
      schemas: {
        [SCHEMAS.CITY]: {
          type: SWAGGER.OBJECT_TYPE,
          properties: {
            [CITY_FIELDS.ID]: { type: SWAGGER.STRING_TYPE, example: SWAGGER.EXAMPLES.ID },
            [CITY_FIELDS.NAME]: { type: SWAGGER.STRING_TYPE, example: SWAGGER.EXAMPLES.CITY_NAME },
            [CITY_FIELDS.POPULATION]: { type: SWAGGER.NUMBER_TYPE, example: SWAGGER.EXAMPLES.POPULATION },
            [CITY_FIELDS.COUNTRY]: { type: SWAGGER.STRING_TYPE, example: SWAGGER.EXAMPLES.COUNTRY },
            [CITY_FIELDS.LATITUDE]: { type: SWAGGER.NUMBER_TYPE, example: SWAGGER.EXAMPLES.LATITUDE },
            [CITY_FIELDS.LONGITUDE]: { type: SWAGGER.NUMBER_TYPE, example: SWAGGER.EXAMPLES.LONGITUDE },
            [CITY_FIELDS.CREATED_AT]: { type: SWAGGER.STRING_TYPE, format: SWAGGER.FORMATS.DATE_TIME },
            [CITY_FIELDS.UPDATED_AT]: { type: SWAGGER.STRING_TYPE, format: SWAGGER.FORMATS.DATE_TIME }
          },
          required: [
            CITY_FIELDS.NAME,
            CITY_FIELDS.POPULATION,
            CITY_FIELDS.COUNTRY,
            CITY_FIELDS.LATITUDE,
            CITY_FIELDS.LONGITUDE
          ]
        },
        [SCHEMAS.ERROR]: {
          type: SWAGGER.OBJECT_TYPE,
          properties: {
            [ERROR_FIELDS.ERROR]: {
              type: SWAGGER.OBJECT_TYPE,
              properties: {
                [ERROR_FIELDS.MESSAGE]: { type: SWAGGER.STRING_TYPE, example: SWAGGER.EXAMPLES.ERROR_MESSAGE },
                [ERROR_FIELDS.STATUS]: { type: SWAGGER.INTEGER_TYPE, example: SWAGGER.EXAMPLES.STATUS }
              }
            }
          }
        }
      }
    }
  },
  apis: [SWAGGER.API_FILES_GLOB]
};

const swaggerSpecs: SwaggerOptions = swaggerJsdoc(swaggerOptions);

export default swaggerSpecs;