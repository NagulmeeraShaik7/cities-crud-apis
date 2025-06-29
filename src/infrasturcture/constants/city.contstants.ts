/**
 * City-related messages for user feedback
 * @constant {Object}
 * @property {string} ADDED - Message for successful city addition
 * @property {string} UPDATED - Message for successful city update
 * @property {string} DELETED - Message for successful city deletion
 */
export const CITY_MESSAGES = {
  ADDED: "City added successfully",
  UPDATED: "City updated successfully",
  DELETED: "City deleted successfully"
};

/**
 * Default sorting and ordering options for city queries
 * @constant {Object}
 * @property {string} SORT_BY - Default field to sort by
 * @property {string} ORDER - Default order of sorting (asc or desc)
 */

export const DEFAULTS = {
  SORT_BY: "name",
  ORDER: "asc"
}; 

/**
 * Route paths for city-related operations
 * @constant {Object}
 * @property {string} BASE - Base path for city routes
 * @property {string} BY_ID - Path for operations on a specific city by ID
 */

export const CITY_ROUTE_PATHS = {
  BASE: "/",
  BY_ID: "/:id"
};

/**
 * Tag for city-related routes in API documentation
 * @constant {string}
 */
export const CITY_ROUTE_TAG = "Cities";




/**
 * Error messages related to city operations
 * @constant {Object}
 * @property {string} NAME_UNIQUE - Error message for non-unique city name
 * @property {string} NOT_FOUND - Error message when a city is not found
 */
export const CITY_ERRORS = {
  NAME_UNIQUE: "City name must be unique",
  NOT_FOUND: "City not found"
};

/**
 * Logger prefixes for different log levels
 * @constant {Object}
 * @property {string} INFO - Prefix for informational logs
 * @property {string} ERROR - Prefix for error logs
 */
export const LOGGER_PREFIX = {
  INFO: "[INFO]",
  ERROR: "[ERROR]"
};


/**
 * Constants for search operations
 * @constant {Object}
 * @property {string} STRING_TYPE - Type for string search
 * @property {string} NUMBER_TYPE - Type for number search
 * @property {string} REGEX_OPTIONS - Options for regex search
 * @property {string} MONGO_OR - MongoDB operator for logical OR
 * @property {string} REGEX - MongoDB operator for regex search
 * @description These constants are used to build search queries in the application.
 * They help in defining the types of searches, regex options, and MongoDB operators used in
 */
export const SEARCH_CONSTANTS = {
  STRING_TYPE: "String",
  NUMBER_TYPE: "Number",
  REGEX_OPTIONS: "i",
  MONGO_OR: "$or",
  REGEX: "$regex"
};

/**
 * Constants for Swagger documentation
 * @constant {Object}  
 * @property {string} OPENAPI_VERSION - OpenAPI version
 * @property {string} TITLE - Title of the API
 * @property {string} VERSION - Version of the API
 * @property {string} DESCRIPTION - Description of the API
 * @property {string} LOCAL_SERVER_DESCRIPTION - Description for the local server
 * @property {number} DEFAULT_PORT - Default port for the API
 * @property {string} PROTOCOL - Protocol used by the API (http or https)
 * @property {string} HOST - Hostname for the API 
 * @property {string} OBJECT_TYPE - Type for object schemas
 * @property {string} STRING_TYPE - Type for string schemas
 * @property {string} NUMBER_TYPE - Type for number schemas
 * @property {string} INTEGER_TYPE - Type for integer schemas
 * @property {string} API_FILES_GLOB - Glob pattern for API files to include in Swagger documentation
 * @property {Object} FORMATS - Formats used in the API (e.g., date-time)
 * @property {Object} EXAMPLES - Example values for various fields in the API  
 * @description These constants are used to configure Swagger documentation for the API.
 * They define the OpenAPI version, API title, version, description, server details, and
 */

export const SWAGGER = {
  OPENAPI_VERSION: "3.0.0",
  TITLE: "City Management API",
  VERSION: "1.0.0",
  DESCRIPTION:
    "API for managing a collection of cities with CRUD operations, pagination, filtering, sorting, and searching.",
  LOCAL_SERVER_DESCRIPTION: "Local server",
  DEFAULT_PORT: 3000,
  PROTOCOL: "http",
  HOST: "localhost",
  OBJECT_TYPE: "object",
  STRING_TYPE: "string",
  NUMBER_TYPE: "number",
  INTEGER_TYPE: "integer",
  API_FILES_GLOB: "./src/apps/routers/*.ts",
  FORMATS: {
    DATE_TIME: "date-time"
  },
  EXAMPLES: {
    ID: "507f1f77bcf86cd799439011",
    CITY_NAME: "Tokyo",
    POPULATION: 37400068,
    COUNTRY: "Japan",
    LATITUDE: 35.6895,
    LONGITUDE: 139.6917,
    ERROR_MESSAGE: "Internal Server Error",
    STATUS: 500
  }
};

/**
 * Schemas used in Swagger documentation
 * @constant {Object}
 * @property {string} CITY - Schema for city objects
 * @property {string} ERROR - Schema for error responses
 * @description These schemas define the structure of city objects and error responses in the API.
 * They are used to generate API documentation and validate requests and responses.
 */
export const SCHEMAS = {
  CITY: "City",
  ERROR: "Error"
};

/**
 * Fields used in city documents
 * @constant {Object}
 * @property {string} ID - Unique identifier for the city
 * @property {string} NAME - Name of the city
 * @property {number} POPULATION - Population of the city
 * @property {string} COUNTRY - Country where the city is located
 * @property {number} LATITUDE - Latitude coordinate of the city
 * @property {number} LONGITUDE - Longitude coordinate of the city
 * @property {string} CREATED_AT - Timestamp when the city was created
 * @property {string} UPDATED_AT - Timestamp when the city was last updated
 * @description These fields represent the properties of a city document in the database.
 * They are used in the city model and Swagger documentation to define the structure of city data.
 */

export const CITY_FIELDS = {
  ID: "_id",
  NAME: "name",
  POPULATION: "population",
  COUNTRY: "country",
  LATITUDE: "latitude",
  LONGITUDE: "longitude",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt"
};

/**
 * Fields used in error responses
 * @constant {Object}
 * @property {string} ERROR - Error object containing details about the error
 * @property {string} MESSAGE - Error message describing the error
 * @property {string} STATUS - HTTP status code for the error
 * @description These fields are used in error responses to provide information about the error that occurred.
 * They are included in the Swagger documentation to define the structure of error responses.
 */

export const ERROR_FIELDS = {
  ERROR: "error",
  MESSAGE: "message",
  STATUS: "status"
};

/**
 * Constants for error handling in the application
 * @constant {Object}
 * @property {string} DEFAULT_MESSAGE - Default error message when no specific message is provided
 * @property {number} DEFAULT_STATUS - Default HTTP status code for errors
 * @property {string} RESPONSE_KEY - Key used in error responses to indicate the error object
 * @property {string} MESSAGE_KEY - Key used in error responses to indicate the error message
 * @property {string} STATUS_KEY - Key used in error responses to indicate the HTTP status code
 * @property {string} LOG_PREFIX - Prefix used in logs for error messages
 */


export const ERROR_CONSTANTS = {
  DEFAULT_MESSAGE: "Internal Server Error",
  DEFAULT_STATUS: 500,
  RESPONSE_KEY: "error",
  MESSAGE_KEY: "message",
  STATUS_KEY: "status",
  LOG_PREFIX: "Error"
};

/**
 * Constants for server configuration and logging
 * @constant {Object}
 * @property {Object} DEFAULTS - Default values for server configuration
 * @property {Object} ENV - Environment variable names for server configuration
 * @property {Object} ROUTES - API route paths
 * @property {Object} MESSAGES - Messages for server status and API running
 * @property {Object} ERRORS - Error messages related to server configuration
 * @property {Object} LOGS - Log messages for various server events
 */

export const SERVER_CONSTANTS = {
  DEFAULTS: {
    PORT: 3000,
    HOST: "localhost",
    PROTOCOL: "http"
  },
  ENV: {
    PORT: "PORT",
    MONGO_URI: "MONGO_URI"
  },
  ROUTES: {
    API_DOCS: "/api-docs",
    ROOT: "/",
    CITIES: "/api/cities"
  },
  MESSAGES: {
    API_RUNNING: "City Management API is running"
  },
  ERRORS: {
    MONGO_URI_UNDEFINED: "MONGO_URI environment variable is not defined"
  },
  LOGS: {
    SWAGGER_AVAILABLE: "Swagger UI available at",
    API_RUNNING: "City Management API is running",
    CITY_ROUTE: "API cities Route set:",
    SERVER_RUNNING: "Server running at",
    MONGO_CONNECTED: "Connected to MongoDB",
    MONGO_CONNECTION_ERROR: "MongoDB connection error:"
  }
};


