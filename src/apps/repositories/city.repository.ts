import CityModel, { ICity } from "../models/city.model";
import { buildSearchQuery } from "../utils/search.utils";
import { paginateData } from "../utils/pagination.utils";
import { DEFAULTS } from "../../infrasturcture/constants/city.contstants";

/**
 * Repository class for handling operations related to cities.
 */
export class CityRepository {
  /**
   * Creates a new city in the database.
   * @async
   * @param {Partial<ICity>} city - The city data to create.
   * @returns {Promise<ICity>} Resolves with the created city document.
   */
  async create(city: Partial<ICity>): Promise<ICity> {
    return await CityModel.create(city);
  }

  /**
   * Finds a city by its name.
   * @async
   * @param {string} name - The name of the city to find.
   * @returns {Promise<ICity | null>} Resolves with the city document or null if not found.
   */
  async findByName(name: string): Promise<ICity | null> {
    return await CityModel.findOne({ name });
  }

  /**
   * Finds a city by its ID.
   * @async
   * @param {string} id - The ID of the city to find.
   * @returns {Promise<ICity | null>} Resolves with the city document or null if not found.
   */
  async findById(id: string): Promise<ICity | null> {
    return await CityModel.findById(id);
  }

  /**
   * Updates a city by its ID.
   * @async
   * @param {string} id - The ID of the city to update.
   * @param {Partial<ICity>} city - The updated city data.
   * @returns {Promise<ICity | null>} Resolves with the updated city document or null if not found.
   */
  async update(id: string, city: Partial<ICity>): Promise<ICity | null> {
    return await CityModel.findByIdAndUpdate(id, city, { new: true });
  }

  /**
   * Deletes a city by its ID.
   * @async
   * @param {string} id - The ID of the city to delete.
   * @returns {Promise<ICity | null>} Resolves with the deleted city document or null if not found.
   */
  async delete(id: string): Promise<ICity | null> {
    return await CityModel.findByIdAndDelete(id);
  }

  /**
   * Retrieves all cities with optional search, sorting, and pagination.
   * @async
   * @param {string} [searchKey] - The search query for filtering cities.
   * @param {number} [page] - The page number for pagination.
   * @param {number} [limit] - The number of items per page.
   * @param {string} [sortBy="name"] - The field to sort results by.
   * @param {string} [order="asc"] - The sorting order ('asc' or 'desc').
   * @param {object} [filter] - Additional filter criteria.
   * @param {object} [projection] - Fields to include or exclude in the response.
   * @returns {Promise<object>} Resolves with an object containing the filtered, sorted, and paginated results.
   */
  async getAll(
    searchKey?: string,
    page?: number,
    limit?: number,
    sortBy: string = DEFAULTS.SORT_BY,
    order: string = DEFAULTS.ORDER,
    filter?: object,
    projection?: Record<string, 0 | 1> | string
  ) {
    const query = await this.buildQuery(searchKey, filter);
    const totalItems = await this.getTotalCount(query);
    const cities = await this.fetchCities(query, sortBy, order, page, limit, projection);
    const metadata = this.buildMetadata(cities, totalItems, page, limit);
    return { data: cities, metadata };
  }

  /**
   * Builds the query object based on search and filter criteria.
   * @async
   * @param {string} [searchKey] - The search keyword used to filter results.
   * @param {object} [filter] - Additional filter criteria.
   * @returns {Promise<object>} Resolves with a MongoDB query object.
   */
  async buildQuery(searchKey?: string, filter?: object): Promise<object> {
    let query: any = filter ? { ...filter } : {};
    if (searchKey) {
      const searchQuery = await buildSearchQuery(searchKey, CityModel);
      query = { ...query, ...searchQuery };
    }
    return query;
  }

  /**
   * Gets the total count of documents matching the query.
   * @async
   * @param {object} query - The MongoDB query object used for filtering results.
   * @returns {Promise<number>} Resolves with the total number of matching documents.
   */
  async getTotalCount(query: object): Promise<number> {
    return await CityModel.countDocuments(query);
  }

  /**
   * Fetches cities from the database with sorting and pagination.
   * @async
   * @param {object} query - The MongoDB query object used to retrieve cities.
   * @param {string} sortBy - The field name to sort the results by.
   * @param {string} order - Sorting order, either 'asc' or 'desc'.
   * @param {number} [page] - The page number for pagination.
   * @param {number} [limit] - The number of items per page.
   * @param {object} [projection] - Fields to include or exclude in the response.
   * @returns {Promise<Array<ICity>>} Resolves with an array of city documents.
   */
  async fetchCities(
    query: object,
    sortBy: string,
    order: string,
    page?: number,
    limit?: number,
    projection?: Record<string, 0 | 1> | string
  ): Promise<(ICity & { _id: any })[]> {
    let queryBuilder = CityModel.find<ICity>(query);
    if (projection !== undefined) {
      queryBuilder = queryBuilder.select(projection);
    }
    const result = await queryBuilder
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip(page && limit ? (page - 1) * limit : 0)
      .limit(limit || 0)
      .exec();
    return result;
  }

  /**
   * Builds pagination metadata.
   * @param {Array<ICity>} cities - The list of retrieved cities.
   * @param {number} totalItems - The total number of matching cities.
   * @param {number} [page] - The current page number.
   * @param {number} [limit] - The number of cities per page.
   * @returns {object} An object containing pagination metadata.
   */
  buildMetadata(cities: ICity[], totalItems: number, page?: number, limit?: number): object {
    return page && limit ? paginateData(cities, page, limit, totalItems).metadata : {};
  }
}
