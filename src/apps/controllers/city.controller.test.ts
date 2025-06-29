import { CityController } from './city.controller'; // Adjust path as needed
import { CityUsecase } from '../usecases/city.usecase'; // Adjust path as needed
import { CITY_MESSAGES } from '../../infrasturcture/constants/city.contstants'; // Adjust path as needed

// Mock the CityUsecase
jest.mock('../usecases/city.usecase'); // Adjust path as needed

describe('CityController', () => {
  let cityController: CityController;
  let mockCityUsecase: jest.Mocked<CityUsecase>;

  // Before each test, re-initialize the controller and mock usecase
  beforeEach(() => {
    // Clear all instances and calls to constructors and all methods:
    jest.clearAllMocks();

    cityController = new CityController();
    // Get the mocked instance to spy on its methods
    mockCityUsecase = (CityUsecase as jest.Mock).mock.instances[0];
  });

  describe('constructor', () => {
    it('should initialize CityUsecase', () => {
      expect(CityUsecase).toHaveBeenCalledTimes(1);
      expect(cityController.usecase).toBeInstanceOf(CityUsecase);
    });
  });

  describe('create', () => {
    it('should create a city and return 201 status with message and data', async () => {
      const mockCityData = { name: 'Test City', country: 'Test Country' };
      const mockCreatedCity = {
        id: '123',
        name: 'Test City',
        country: 'Test Country',
        population: 100000,
        latitude: 12.34,
        longitude: 56.78,
        _id: 'mockObjectId',
        state: 'Test State',
        area: 123.45,
        timezone: 'UTC+5:30',
        createdAt: new Date(),
        updatedAt: new Date(),
        // ...add any other required fields from ICity here
      } as unknown as import('../models/city.model').ICity; // Assuming ICity exists

      mockCityUsecase.addCity.mockResolvedValue(mockCreatedCity);

      const req = { body: mockCityData };
      const res = {
        status: jest.fn().mockReturnThis(), // Allow chaining .json()
        json: jest.fn(),
      };
      const next = jest.fn();

      await cityController.create(req, res, next);

      expect(mockCityUsecase.addCity).toHaveBeenCalledTimes(1);
      expect(mockCityUsecase.addCity).toHaveBeenCalledWith(mockCityData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: CITY_MESSAGES.ADDED,
        data: mockCreatedCity,
      });
      expect(next).not.toHaveBeenCalled(); // next should not be called on success
    });

    it('should call next with error if addCity fails', async () => {
      const mockError = new Error('Failed to add city');
      mockCityUsecase.addCity.mockRejectedValue(mockError);

      const req = { body: { name: 'Test City' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await cityController.create(req, res, next);

      expect(mockCityUsecase.addCity).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled(); // status and json not called on error
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a city and return 200 status with message and data', async () => {
      const cityId = '123';
      const updateData = { name: 'Updated City' };
      const mockUpdatedCity = {
        id: cityId,
        name: 'Updated City',
        country: 'Test Country',
        population: 100000,
        latitude: 12.34,
        longitude: 56.78,
        _id: 'mockObjectId',
        // Add all other required fields with mock values
        state: 'Test State',
        area: 123.45,
        timezone: 'UTC+5:30',
        createdAt: new Date(),
        updatedAt: new Date(),
        // ...add any other required fields from ICity here
      } as unknown as import('../models/city.model').ICity; // Assuming ICity exists

      mockCityUsecase.updateCity.mockResolvedValue(mockUpdatedCity);

      const req = { params: { id: cityId }, body: updateData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await cityController.update(req, res, next);

      expect(mockCityUsecase.updateCity).toHaveBeenCalledTimes(1);
      expect(mockCityUsecase.updateCity).toHaveBeenCalledWith(cityId, updateData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: CITY_MESSAGES.UPDATED,
        data: mockUpdatedCity,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if updateCity fails', async () => {
      const mockError = new Error('Failed to update city');
      mockCityUsecase.updateCity.mockRejectedValue(mockError);

      const req = { params: { id: '123' }, body: { name: 'Updated City' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await cityController.update(req, res, next);

      expect(mockCityUsecase.updateCity).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a city and return 200 status with success message', async () => {
      const cityId = '123';
      mockCityUsecase.deleteCity.mockResolvedValue(undefined); // delete doesn't return data

      const req = { params: { id: cityId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await cityController.delete(req, res, next);

      expect(mockCityUsecase.deleteCity).toHaveBeenCalledTimes(1);
      expect(mockCityUsecase.deleteCity).toHaveBeenCalledWith(cityId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: CITY_MESSAGES.DELETED,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if deleteCity fails', async () => {
      const mockError = new Error('Failed to delete city');
      mockCityUsecase.deleteCity.mockRejectedValue(mockError);

      const req = { params: { id: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await cityController.delete(req, res, next);

      expect(mockCityUsecase.deleteCity).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should retrieve all cities with default parameters and return 200 status with data and metadata', async () => {
      const mockCities = [{
        id: '1',
        name: 'City A',
        country: 'Test Country',
        population: 100000,
        latitude: 12.34,
        longitude: 56.78,
        _id: 'mockObjectId',
        state: 'Test State',
        area: 123.45,
        timezone: 'UTC+5:30',
        createdAt: new Date(),
        updatedAt: new Date(),
        // ...add any other required fields from ICity here
      } as unknown as import('../models/city.model').ICity]; // Assuming ICity exists
      const mockMetadata = { total: 1, page: 1, limit: 10 };
      mockCityUsecase.getAll.mockResolvedValue({ data: mockCities, metadata: mockMetadata });

      const req = { query: {} }; // No query params, so defaults should be used
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await cityController.getAll(req, res, next);

      expect(mockCityUsecase.getAll).toHaveBeenCalledTimes(1);
      expect(mockCityUsecase.getAll).toHaveBeenCalledWith(
        undefined, // searchKey
        undefined, // page
        undefined, // limit
        undefined, // sortBy
        undefined, // order
        undefined, // parsedFilter
        undefined  // parsedProjection
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockCities,
        metadata: mockMetadata,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should retrieve cities with all query parameters and return 200 status with data and metadata', async () => {
      const mockCities = [{
        id: '1',
        name: 'Filtered City',
        country: 'Test Country',
        population: 100000,
        latitude: 12.34,
        longitude: 56.78,
        _id: 'mockObjectId',
        state: 'Test State',
        area: 123.45,
        timezone: 'UTC+5:30',
        createdAt: new Date(),
        updatedAt: new Date(),
        // ...add any other required fields from ICity here
      } as unknown as import('../models/city.model').ICity]; // Assuming ICity exists
      const mockMetadata = { total: 1, page: 1, limit: 5 };
      mockCityUsecase.getAll.mockResolvedValue({ data: mockCities, metadata: mockMetadata });

      const req = {
        query: {
          searchKey: 'test',
          page: '1',
          limit: '5',
          sortBy: 'name',
          order: 'asc',
          filter: JSON.stringify({ country: 'India' }),
          projection: JSON.stringify({ name: 1 }),
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await cityController.getAll(req, res, next);

      expect(mockCityUsecase.getAll).toHaveBeenCalledTimes(1);
      expect(mockCityUsecase.getAll).toHaveBeenCalledWith(
        'test',
        '1',
        '5',
        'name',
        'asc',
        { country: 'India' },
        { name: 1 }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockCities,
        metadata: mockMetadata,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if getAll fails', async () => {
      const mockError = new Error('Failed to get all cities');
      mockCityUsecase.getAll.mockRejectedValue(mockError);

      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await cityController.getAll(req, res, next);

      // Corrected typo here
      expect(mockCityUsecase.getAll).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle invalid JSON for filter or projection gracefully by calling next', async () => {
      const req = {
        query: {
          filter: '{invalid JSON', // Invalid JSON
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await cityController.getAll(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
      // Updated to match a more general part of the JSON parsing error message
      expect(next.mock.calls[0][0].message).toContain("Expected property name or '}'");
      expect(mockCityUsecase.getAll).not.toHaveBeenCalled(); // Usecase should not be called if parsing fails
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
