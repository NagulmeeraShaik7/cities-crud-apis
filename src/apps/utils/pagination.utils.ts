/**
 * Utility to handle pagination logic for GET APIs.
 * Validates and calculates paginated results from the given data.
 *
 * @param {Array} data - The full array of data to paginate.
 * @param {number} page - The current page number (default: 1).
 * @param {number} limit - The number of items per page (default: 10).
 * @param {number} totalItems - Total items across all pages combined.
 * @param {boolean} isNotPaginated - If data is not paginated in repository, then paginate here.
 * @returns {object} - Paginated results and metadata.
 */
export const paginateData = (
  data: any[],
  page: number = 1,
  limit: number = 10,
  totalItems: number,
  isNotPaginated: boolean = false
) => {
  const validatedPage = Math.max(1, parseInt(page.toString(), 10) || 1);
  const validatedLimit = Math.max(1, parseInt(limit.toString(), 10) || 10);

  const startIndex = (validatedPage - 1) * validatedLimit;
  const endIndex = startIndex + validatedLimit;

  const dataArray = Array.isArray(data) ? data : Object.values(data);
  if (isNotPaginated) {
    data = dataArray.slice(startIndex, endIndex);
  }

  return {
    paginatedResults: data,
    metadata: {
      currentPage: validatedPage,
      itemsPerPage: validatedLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / validatedLimit)
    }
  };
};