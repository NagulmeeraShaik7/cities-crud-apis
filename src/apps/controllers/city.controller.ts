import { CityUsecase } from "../usecases/city.usecase";
import { CITY_MESSAGES } from "../../infrasturcture/constants/city.contstants";

/**
 * Controller for cities.
 */
export class CityController {
  public usecase: CityUsecase;

  /**
   * Initializes the CityController.
   * @description Sets up the use case instance for city handling.
   */
  constructor() {
    this.usecase = new CityUsecase();
  }

  /**
   * Creates a new city.
   * @async
   * @param {object} req - Express request object containing city data in the body.
   * @param {object} res - Express response object for sending response.
   * @param {Function} next - Express next function for error handling.
   * @returns {Promise<void>} Responds with the created city.
   */
  async create(req: any, res: any, next: any) {
    try {
      const city = await this.usecase.addCity(req.body);
      res.status(201).json({ message: CITY_MESSAGES.ADDED, data: city });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Updates an existing city.
   * @async
   * @param {object} req - Express request object containing city ID and updated data.
   * @param {object} res - Express response object for sending response.
   * @param {Function} next - Express next function for error handling.
   * @returns {Promise<void>} Responds with the updated city.
   */
  async update(req: any, res: any, next: any) {
    try {
      const city = await this.usecase.updateCity(req.params.id, req.body);
      res.status(200).json({ message: CITY_MESSAGES.UPDATED, data: city });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Deletes a city.
   * @async
   * @param {object} req - Express request object containing city ID.
   * @param {object} res - Express response object for sending response.
   * @param {Function} next - Express next function for error handling.
   * @returns {Promise<void>} Responds with a success message.
   */
  async delete(req: any, res: any, next: any) {
    try {
      await this.usecase.deleteCity(req.params.id);
      res.status(200).json({ message: CITY_MESSAGES.DELETED });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Retrieves all cities with optional search, sorting, pagination, and filtering.
   * @async
   * @param {object} req - Express request object containing query parameters.
   * @param {object} res - Express response object for sending response.
   * @param {Function} next - Express next function for error handling.
   * @returns {Promise<void>} Responds with the list of cities and metadata.
   */
  async getAll(req: any, res: any, next: any) {
    try {
      const { searchKey, page, limit, sortBy, order, filter, projection } = req.query;
      const parsedFilter = filter ? JSON.parse(filter) : undefined;
      const parsedProjection = projection ? JSON.parse(projection) : undefined;
      const { data, metadata } = await this.usecase.getAll(
        searchKey,
        page,
        limit,
        sortBy,
        order,
        parsedFilter,
        parsedProjection
      );
      res.status(200).json({ data, metadata });
    } catch (error: any) {
      next(error);
    }
  }
}
