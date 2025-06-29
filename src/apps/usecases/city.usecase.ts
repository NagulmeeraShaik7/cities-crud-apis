import { CityRepository } from "../repositories/city.repository";
import { ICity } from "../models/city.model";
import { CITY_ERRORS } from "../../infrasturcture/constants/city.contstants";

/**
 * Use case layer for cities.
 */
export class CityUsecase {
  public repository: CityRepository;

  /**
   * Initializes the CityUsecase.
   * @description Sets up the repository instance for managing cities.
   */
  constructor() {
    this.repository = new CityRepository();
  }

  /**
   * Creates a new city.
   * @async
   * @param {Partial<ICity>} city - The city data to create.
   * @returns {Promise<ICity>} Resolves with the created city document.
   * @throws {Error} If the city name is not unique.
   */
  async addCity(city: Partial<ICity>): Promise<ICity> {
    const existingCity = await this.repository.findByName(city.name!);
    if (existingCity) {
      throw new Error(CITY_ERRORS.NAME_UNIQUE);
    }
    return await this.repository.create(city);
  }

  /**
   * Updates an existing city.
   * @async
   * @param {string} id - The ID of the city to update.
   * @param {Partial<ICity>} city - The updated city data.
   * @returns {Promise<ICity>} Resolves with the updated city document.
   * @throws {Error} If the city is not found or the new name is not unique.
   */
  async updateCity(id: string, city: Partial<ICity>): Promise<ICity> {
    const existingCity = await this.repository.findById(id);
    if (!existingCity) {
      throw new Error(CITY_ERRORS.NOT_FOUND);
    }
    if (city.name && city.name !== existingCity.name) {
      const nameExists = await this.repository.findByName(city.name);
      if (nameExists) {
        throw new Error(CITY_ERRORS.NAME_UNIQUE);
      }
    }
    return (await this.repository.update(id, city))!;
  }

  /**
   * Deletes a city by its ID.
   * @async
   * @param {string} id - The ID of the city to delete.
   * @returns {Promise<void>} Resolves when the city is deleted.
   * @throws {Error} If the city is not found.
   */
  async deleteCity(id: string): Promise<void> {
    const city = await this.repository.findById(id);
    if (!city) {
      throw new Error(CITY_ERRORS.NOT_FOUND);
    }
    await this.repository.delete(id);
  }

  /**
   * Retrieves all cities with optional search, sorting, pagination, and filtering.
   * @async
   * @param {string} [searchKey] - The search query.
   * @param {number} [page] - The page number for pagination.
   * @param {number} [limit] - The number of items per page.
   * @param {string} [sortBy] - The field to sort results by.
   * @param {string} [order] - The sorting order ('asc' or 'desc').
   * @param {object} [filter] - Additional filter criteria.
   * @param {Record<string, 0 | 1> | string} [projection] - Fields to include or exclude in the response.
   * @returns {Promise<object>} Resolves with an object containing paginated, sorted results and metadata.
   */
  async getAll(
    searchKey?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    order?: string,
    filter?: object,
    projection?: Record<string, 0 | 1> | string
  ) {
    return await this.repository.getAll(searchKey, page, limit, sortBy, order, filter, projection);
  }
}
