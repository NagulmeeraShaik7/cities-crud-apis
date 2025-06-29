# City Management API

A RESTful API for managing a collection of cities, supporting CRUD operations (Create, Read, Update, Delete) with pagination, filtering, sorting, and searching capabilities. Built with Node.js, Express, TypeScript, MongoDB, and Mongoose, the API includes Swagger documentation and unit tests for robust development.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features
- **CRUD Operations**: Create, read, update, and delete city records.
- **Pagination**: Retrieve cities with page and limit parameters.
- **Filtering**: Filter cities by fields like country.
- **Sorting**: Sort results by fields like population or name.
- **Searching**: Search cities by name.
- **Swagger Documentation**: Interactive API documentation at `/api-docs`.
- **Error Handling**: Centralized error middleware for consistent responses.
- **Unit Tests**: Tests for controllers using Jest.

## Tech Stack
- **Node.js**: v20.14.0
- **Express**: Web framework for building the API.
- **TypeScript**: For type-safe development.
- **MongoDB**: NoSQL database (MongoDB Atlas or local).
- **Mongoose**: ODM for MongoDB.
- **Swagger**: API documentation with `swagger-jsdoc` and `swagger-ui-express`.
- **Jest**: Testing framework for unit tests.
- **dotenv**: For environment variable management.

## Project Structure

```
.
├── node_modules/
├── dist/
├── src/
│   ├── apps/
│   │   ├── controllers/
│   │   │   ├── city.controller.test.ts
│   │   │   └── city.controller.ts
│   │   ├── models/
│   │   │   └── city.model.ts
│   │   ├── repositories/
│   │   │   ├── city.repository.test.ts
│   │   │   └── city.repository.ts
│   │   ├── routers/
│   │   │   └── city.route.ts
│   │   ├── usecases/
│   │   │   ├── city.usecase.test.ts
│   │   │   └── city.usecase.ts
│   │   └── utils/
│   │       ├── logger.utils.test.ts
│   │       ├── pagination.utils.test.ts
│   │       ├── pagination.utils.ts
│   │       ├── search.utils.test.ts
│   │       └── search.utils.ts
│   ├── infrasturcture/
│   │   ├── config/
│   │   │   └── swaggerConfig.ts
│   │   └── constants/
│   │       └── city.contstants.ts
│   ├── middleware/
│   │   └── error.middleware.ts
│   └── index.ts
├── .env
├── .gitignore
├── babel.config.json
├── jest.config.ts
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
``` 

## Installation 

* Dependencies

   ` npm install ` 

```
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "@types/swagger-jsdoc": "^6.0.1",
    "@types/swagger-ui-express": "^4.1.3",
    "ts-node": "^10.9.1",
    "@types/jest": "^29.5.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "supertest": "^6.3.3",
    "@types/supertest": "^2.0.12"
  }
} 
```

* Start the Server : `npm start` 


## Access the API:


**Root**:  http://localhost:3000

**Swagger UI**: http://localhost:3000/api-docs

**API Endpoints**: http://localhost:3000/api/cities 

# API Endpoints 

**POST** : ` /api/cities ` 
* **Request Body:** 

```{
  "name": "Tokyo",
  "population": 37400068,
  "country": "Japan",
  "latitude": 35.6895,
  "longitude": 139.6917
}
``` 

* **Response (201 Created):** 

```
{
  "message": "City added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Tokyo",
    "population": 37400068,
    "country": "Japan",
    "latitude": 35.6895,
    "longitude": 139.6917,
    "createdAt": "2025-06-29T15:00:00.000Z",
    "updatedAt": "2025-06-29T15:00:00.000Z"
  }
}
```

* **Error Response (500 Internal Server Error):**

```
{
  "error": {
    "message": "City name must be unique",
    "status": 500
  }
}
```

* **GET**: ` /api/cities` 

   * Retrieves a list of cities with optional pagination, filtering, sorting, and searching.

* **Query Parameters:**
     * **searchKey:** Search by city name (e.g., Tokyo).
    * **page:** Page number (default: 1).
    * **limit:** Items per page (default: 10).
    * **sortBy:** Field to sort by (e.g., population, name).
    * **sortOrder:** Sort order (asc or desc, default: asc).
    * **filter:** JSON string for filtering (e.g., `{"country":"Japan"}`).
    * **projection:** JSON string for field selection (e.g., `{"name":1}`).

* **Response (200 OK):**

```
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Tokyo"
    }
  ],
  "metadata": {
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1,
    "itemsPerPage": 10
  }
}
```
* **Error Response (500 Internal Server Error):**

```
{
  "error": {
    "message": "Invalid filter format",
    "status": 500
  }
} 
```
* **PUT:** `/api/cities/:id` 

* **Request Body:** JSON object with updated city information. 
```
{
  "population": 37500000
}
```
* **Response (200 OK):**

```
{
  "message": "City updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Tokyo",
    "population": 37500000,
    "country": "Japan",
    "latitude": 35.6895,
    "longitude": 139.6917,
    "createdAt": "2025-06-29T15:00:00.000Z",
    "updatedAt": "2025-06-29T15:10:00.000Z"
  }
}
```
* **Error Response (404 Not Found):**
```
{
  "error": {
    "message": "City not found",
    "status": 404
  }
}
```
* **Error Response (500 Internal Server Error):**
```
{
    "error": { 
        "message": "Invalid update format",
        "status": 500
    }
}
```

* **DELETE:** `/api/cities/:id` 

   * Deletes a city by ID. 

   **Response: (200 OK)**

   ```
   {
    "message": "City deleted successfully",
   }
   ```

   **Error Response (404 Not Found):**

   ```
   {
      "error": { 
           "message": "City not found",
           "status": 404
       }
   } 
   ```

   **Run Unit Tests command**

   ```
   npx jest
   ```


