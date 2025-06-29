import { SEARCH_CONSTANTS } from "../../infrasturcture/constants/city.contstants";

/**
 * Builds a search query that searches across all fields, including nested ones.
 * @param {string} searchTerm - The search query.
 * @param {object} model - The Mongoose model to search in.
 * @param {object} model.schema - The schema of the Mongoose model.
 * @param {Record<string, { instance: string }>} model.schema.paths - The paths defined in the schema with their types.
 * @returns {Promise<object>} - The MongoDB search query object.
 */
export const buildSearchQuery = async (
  searchTerm: string,
  model: { schema: { paths: Record<string, { instance: string }> } }
): Promise<object> => {
  const schemaPaths = model.schema.paths;
  const searchConditions = [];

  const searchRegex = new RegExp(searchTerm, SEARCH_CONSTANTS.REGEX_OPTIONS);
  const searchNum = !isNaN(Number(searchTerm)) ? Number(searchTerm) : null;

  for (const field in schemaPaths) {
    const fieldType = schemaPaths[field].instance;

    if (fieldType === SEARCH_CONSTANTS.STRING_TYPE) {
      searchConditions.push({ [field]: { [SEARCH_CONSTANTS.REGEX]: searchRegex } });
    } else if (fieldType === SEARCH_CONSTANTS.NUMBER_TYPE && searchNum !== null) {
      searchConditions.push({ [field]: searchNum });
    }
  }

  return searchConditions.length > 0 ? { [SEARCH_CONSTANTS.MONGO_OR]: searchConditions } : {};
};
