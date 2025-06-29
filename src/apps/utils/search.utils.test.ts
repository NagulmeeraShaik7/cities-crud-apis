import { buildSearchQuery } from './search.utils';
import { SEARCH_CONSTANTS } from '../../infrasturcture/constants/city.contstants';

describe('buildSearchQuery', () => {
  const mockModel = {
    schema: {
      paths: {
        name: { instance: SEARCH_CONSTANTS.STRING_TYPE },
        population: { instance: SEARCH_CONSTANTS.NUMBER_TYPE },
        country: { instance: SEARCH_CONSTANTS.STRING_TYPE },
        latitude: { instance: SEARCH_CONSTANTS.NUMBER_TYPE },
        longitude: { instance: SEARCH_CONSTANTS.NUMBER_TYPE },
        _id: { instance: 'ObjectId' }, // Non-searchable field
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build a query for string fields with regex', async () => {
    const searchTerm = 'Test';
    const expectedRegex = new RegExp(searchTerm, SEARCH_CONSTANTS.REGEX_OPTIONS);
    const expectedQuery = {
      [SEARCH_CONSTANTS.MONGO_OR]: [
        { name: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
        { country: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
      ],
    };

    const result = await buildSearchQuery(searchTerm, mockModel);

    expect(result).toEqual(expectedQuery);
  });

  it('should build a query for number fields with exact match', async () => {
    const searchTerm = '100000';
    const searchNum = 100000;
    const expectedRegex = new RegExp(searchTerm, SEARCH_CONSTANTS.REGEX_OPTIONS);
    const expectedQuery = {
      [SEARCH_CONSTANTS.MONGO_OR]: expect.arrayContaining([
        { name: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
        { country: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
        { population: searchNum },
        { latitude: searchNum },
        { longitude: searchNum },
      ]),
    };

    const result = await buildSearchQuery(searchTerm, mockModel);

    expect(result).toMatchObject(expectedQuery);
    expect((result as Record<string, any[]>)[SEARCH_CONSTANTS.MONGO_OR]).toHaveLength(5);
  });

  it('should build a query for both string and number fields', async () => {
    const searchTerm = '42';
    const searchNum = 42;
    const expectedRegex = new RegExp(searchTerm, SEARCH_CONSTANTS.REGEX_OPTIONS);
    const expectedQuery = {
      [SEARCH_CONSTANTS.MONGO_OR]: expect.arrayContaining([
        { name: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
        { country: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
        { population: searchNum },
        { latitude: searchNum },
        { longitude: searchNum },
      ]),
    };

    const result = await buildSearchQuery(searchTerm, mockModel);

    expect(result).toMatchObject(expectedQuery);
    expect((result as Record<string, any[]>)[SEARCH_CONSTANTS.MONGO_OR]).toHaveLength(5);
  });

  it('should return a query with regex for strings and 0 for numbers for empty search term', async () => {
    const searchTerm = '';
    const expectedRegex = new RegExp(searchTerm, SEARCH_CONSTANTS.REGEX_OPTIONS);
    const expectedQuery = {
      [SEARCH_CONSTANTS.MONGO_OR]: expect.arrayContaining([
        { name: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
        { country: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
        { population: 0 },
        { latitude: 0 },
        { longitude: 0 },
      ]),
    };

    const result = await buildSearchQuery(searchTerm, mockModel);

    expect(result).toMatchObject(expectedQuery);
    expect((result as Record<string, any[]>)[SEARCH_CONSTANTS.MONGO_OR]).toHaveLength(5);
  });

  it('should exclude non-string and non-number fields', async () => {
    const searchTerm = 'Test';
    const expectedRegex = new RegExp(searchTerm, SEARCH_CONSTANTS.REGEX_OPTIONS);
    const expectedQuery = {
      [SEARCH_CONSTANTS.MONGO_OR]: [
        { name: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
        { country: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
      ],
    };

    const result = await buildSearchQuery(searchTerm, mockModel);

    expect(result).toEqual(expectedQuery);
    expect((result as Record<string, any[]>)[SEARCH_CONSTANTS.MONGO_OR]).not.toContainEqual(
      expect.objectContaining({ _id: expect.anything() })
    );
  });

  it('should handle schema with no searchable fields', async () => {
    const searchTerm = 'Test';
    const emptyModel = {
      schema: {
        paths: {
          _id: { instance: 'ObjectId' },
          createdAt: { instance: 'Date' },
        },
      },
    };

    const result = await buildSearchQuery(searchTerm, emptyModel);

    expect(result).toEqual({});
  });

  it('should handle non-numeric search term for number fields', async () => {
    const searchTerm = 'non-numeric';
    const expectedRegex = new RegExp(searchTerm, SEARCH_CONSTANTS.REGEX_OPTIONS);
    const expectedQuery = {
      [SEARCH_CONSTANTS.MONGO_OR]: [
        { name: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
        { country: { [SEARCH_CONSTANTS.REGEX]: expectedRegex } },
      ],
    };

    const result = await buildSearchQuery(searchTerm, mockModel);

    expect(result).toEqual(expectedQuery);
  });
});