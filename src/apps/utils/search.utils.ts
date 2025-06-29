/**
 * Builds a search query that searches across all fields, including nested ones.
 * @param {string} searchTerm - The search query.
 * @param {object} model - The Mongoose model to search in.
 * @param {object  model.schema - The schema of the Mongoose model.
 * @param {Record<string, { instance: string }>} model.schema.paths - The paths defined in the schema with their types.
 * @returns {Promise<object>} - The MongoDB search query object.
 */
export const buildSearchQuery = async (
  searchTerm: string,
  model: { schema: { paths: Record<string, { instance: string }> } }
): Promise<object> => {
  const schemaPaths = model.schema.paths;
  const searchConditions = [];

  // Convert search term to number where possible
  const searchRegex = new RegExp(searchTerm, "i");
  const searchNum = !isNaN(Number(searchTerm)) ? Number(searchTerm) : null;

  for (const field in schemaPaths) {
    const fieldType = schemaPaths[field].instance;

    if (fieldType === "String") {
      searchConditions.push({ [field]: { $regex: searchRegex } });
    } else if (fieldType === "Number" && searchNum !== null) {
      searchConditions.push({ [field]: searchNum });
    }
  }

  return searchConditions.length > 0 ? { $or: searchConditions } : {};
};