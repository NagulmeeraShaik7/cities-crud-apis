import express from "express";
import { CityController } from "../controllers/city.controller";
import {
  CITY_ROUTE_PATHS,
  CITY_ROUTE_TAG,
  CITY_FIELDS,
  CITY_MESSAGES
} from "../../infrasturcture/constants/city.contstants";

const cityRouter = express.Router();
const cityController = new CityController();

/**
 * @swagger
 * /api/cities:
 *   post:
 *     description: Creates a new city.
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               population:
 *                 type: number
 *               country:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: City added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/City"
 */
cityRouter.post(CITY_ROUTE_PATHS.BASE, (req, res, next) => {
  cityController.create(req, res, next);
});

/**
 * @swagger
 * /api/cities/{id}:
 *   put:
 *     description: Updates an existing city.
 *     tags: [Cities]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the city to update.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               population:
 *                 type: number
 *               country:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: City updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/City"
 */
cityRouter.put(CITY_ROUTE_PATHS.BY_ID, (req, res, next) => {
  cityController.update(req, res, next);
});

/**
 * @swagger
 * /api/cities/{id}:
 *   delete:
 *     description: Deletes a city.
 *     tags: [Cities]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the city to delete.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: City deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
cityRouter.delete(CITY_ROUTE_PATHS.BY_ID, (req, res, next) => {
  cityController.delete(req, res, next);
});

/**
 * @swagger
 * /api/cities:
 *   get:
 *     description: Retrieves all cities with optional search, filtering, sorting, and pagination.
 *     tags: [Cities]
 *     parameters:
 *       - name: searchKey
 *         in: query
 *         description: The search term to filter cities.
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: The page number to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: The number of items per page.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: The field to sort results by.
 *         required: false
 *         schema:
 *           type: string
 *           example: name
 *       - name: order
 *         in: query
 *         description: Sort order ('asc' for ascending, 'desc' for descending).
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *       - name: filter
 *         in: query
 *         description: JSON string for additional filtering (e.g., {"country":"Japan"}).
 *         required: false
 *         schema:
 *           type: string
 *       - name: projection
 *         in: query
 *         description: JSON string for field projection (e.g., {"name":1}).
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/City"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 */
cityRouter.get(CITY_ROUTE_PATHS.BASE, (req, res, next) => {
  cityController.getAll(req, res, next);
});

export default cityRouter;
