import { paginateData } from './pagination.utils';

describe('paginateData', () => {
  const mockData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should paginate data with default parameters', () => {
    const result = paginateData(mockData, undefined, undefined, mockData.length);

    expect(result).toEqual({
      paginatedResults: mockData,
      metadata: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 5,
        totalPages: 1,
      },
    });
  });

  it('should paginate data with specified page and limit', () => {
    const result = paginateData(mockData, 2, 2, mockData.length);

    expect(result).toEqual({
      paginatedResults: mockData,
      metadata: {
        currentPage: 2,
        itemsPerPage: 2,
        totalItems: 5,
        totalPages: 3,
      },
    });
  });

  it('should handle non-paginated data and slice correctly', () => {
    const result = paginateData(mockData, 2, 2, mockData.length, true);

    expect(result).toEqual({
      paginatedResults: [{ id: 3, name: 'Item 3' }, { id: 4, name: 'Item 4' }],
      metadata: {
        currentPage: 2,
        itemsPerPage: 2,
        totalItems: 5,
        totalPages: 3,
      },
    });
  });

  it('should validate page to be at least 1', () => {
    const result = paginateData(mockData, -1, 10, mockData.length);

    expect(result.metadata.currentPage).toBe(1);
    expect(result).toEqual({
      paginatedResults: mockData,
      metadata: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 5,
        totalPages: 1,
      },
    });
  });

  it('should validate limit to be at least 1', () => {
    const result = paginateData(mockData, 1, 0, mockData.length, true);

    expect(result.metadata.itemsPerPage).toBe(10);
    expect(result).toEqual({
      paginatedResults: mockData,
      metadata: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 5,
        totalPages: 1,
      },
    });
  });

  it('should handle non-numeric page and limit inputs', () => {
    const result = paginateData(mockData, NaN, NaN, mockData.length);

    expect(result).toEqual({
      paginatedResults: mockData,
      metadata: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 5,
        totalPages: 1,
      },
    });
  });

  it('should handle non-array data by converting to array', () => {
    const nonArrayData = { key1: { id: 1, name: 'Item 1' }, key2: { id: 2, name: 'Item 2' } } as any;
    const result = paginateData(nonArrayData, 1, 10, 2);

    expect(result).toEqual({
      paginatedResults: nonArrayData,
      metadata: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 2,
        totalPages: 1,
      },
    });
  });

  it('should handle non-paginated non-array data and slice correctly', () => {
    const nonArrayData = { key1: { id: 1, name: 'Item 1' }, key2: { id: 2, name: 'Item 2' }, key3: { id: 3, name: 'Item 3' } };
    const result = paginateData(nonArrayData as any, 2, 1, 3, true);

    expect(result).toEqual({
      paginatedResults: [{ id: 2, name: 'Item 2' }],
      metadata: {
        currentPage: 2,
        itemsPerPage: 1,
        totalItems: 3,
        totalPages: 3,
      },
    });
  });

  it('should handle empty data array', () => {
    const result = paginateData([], 1, 10, 0);

    expect(result).toEqual({
      paginatedResults: [],
      metadata: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
      },
    });
  });

  it('should calculate correct totalPages when totalItems is not evenly divisible', () => {
    const result = paginateData(mockData, 1, 3, mockData.length);

    expect(result.metadata.totalPages).toBe(2);
    expect(result).toEqual({
      paginatedResults: mockData,
      metadata: {
        currentPage: 1,
        itemsPerPage: 3,
        totalItems: 5,
        totalPages: 2,
      },
    });
  });
});