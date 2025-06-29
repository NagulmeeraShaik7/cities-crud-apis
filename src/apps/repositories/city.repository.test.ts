import { CityRepository } from './city.repository';
import CityModel, { ICity } from '../models/city.model';
import { buildSearchQuery } from '../utils/search.utils';
import { paginateData } from '../utils/pagination.utils';
import { DEFAULTS } from '../../infrasturcture/constants/city.contstants';

// Mock the dependencies
jest.mock('../models/city.model');
jest.mock('../utils/search.utils');
jest.mock('../utils/pagination.utils');

describe('CityRepository', () => {
  let cityRepository: CityRepository;
  const mockCity = {
    _id: '1',
    name: 'Test City',
    population: 100000,
    country: 'Test Country',
    latitude: 0,
    longitude: 0,
  } as unknown as ICity;

  beforeEach(() => {
    cityRepository = new CityRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new city', async () => {
      (CityModel.create as jest.Mock).mockResolvedValue(mockCity);

      const result = await cityRepository.create(mockCity);

      expect(CityModel.create).toHaveBeenCalledWith(mockCity);
      expect(result).toEqual(mockCity);
    });
  });

  describe('findByName', () => {
    it('should find a city by name', async () => {
      (CityModel.findOne as jest.Mock).mockResolvedValue(mockCity);

      const result = await cityRepository.findByName('Test City');

      expect(CityModel.findOne).toHaveBeenCalledWith({ name: 'Test City' });
      expect(result).toEqual(mockCity);
    });

    it('should return null if city is not found by name', async () => {
      (CityModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await cityRepository.findByName('Nonexistent City');

      expect(CityModel.findOne).toHaveBeenCalledWith({ name: 'Nonexistent City' });
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a city by ID', async () => {
      (CityModel.findById as jest.Mock).mockResolvedValue(mockCity);

      const result = await cityRepository.findById('1');

      expect(CityModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCity);
    });

    it('should return null if city is not found by ID', async () => {
      (CityModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await cityRepository.findById('2');

      expect(CityModel.findById).toHaveBeenCalledWith('2');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a city by ID', async () => {
      const updatedCity = { ...mockCity, name: 'Updated City' };
      (CityModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedCity);

      const result = await cityRepository.update('1', { name: 'Updated City' });

      expect(CityModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'Updated City' }, { new: true });
      expect(result).toEqual(updatedCity);
    });

    it('should return null if city to update is not found', async () => {
      (CityModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await cityRepository.update('2', { name: 'Updated City' });

      expect(CityModel.findByIdAndUpdate).toHaveBeenCalledWith('2', { name: 'Updated City' }, { new: true });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a city by ID', async () => {
      (CityModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockCity);

      const result = await cityRepository.delete('1');

      expect(CityModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCity);
    });

    it('should return null if city to delete is not found', async () => {
      (CityModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await cityRepository.delete('2');

      expect(CityModel.findByIdAndDelete).toHaveBeenCalledWith('2');
      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should retrieve all cities with default parameters', async () => {
      const mockCities = [mockCity];
      const mockQuery = {};
      (CityModel.countDocuments as jest.Mock).mockResolvedValue(1);
      (CityModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCities),
      });

      const result = await cityRepository.getAll();

      expect(buildSearchQuery).not.toHaveBeenCalled();
      expect(CityModel.countDocuments).toHaveBeenCalledWith(mockQuery);
      expect(CityModel.find).toHaveBeenCalledWith(mockQuery);
      expect(CityModel.find().sort).toHaveBeenCalledWith({ [DEFAULTS.SORT_BY]: DEFAULTS.ORDER === 'desc' ? -1 : 1 });
      expect(CityModel.find().skip).toHaveBeenCalledWith(0);
      expect(CityModel.find().limit).toHaveBeenCalledWith(0);
      expect(paginateData).not.toHaveBeenCalled();
      expect(result).toEqual({ data: mockCities, metadata: {} });
    });

    it('should retrieve cities with search, pagination, and sorting', async () => {
      const mockCities = [mockCity];
      const mockQuery = { name: { $regex: 'Test', $options: 'i' } };
      const mockMetadata = { totalItems: 1, totalPages: 1, currentPage: 1 };
      (buildSearchQuery as jest.Mock).mockResolvedValue(mockQuery);
      (CityModel.countDocuments as jest.Mock).mockResolvedValue(1);
      (CityModel.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCities),
      });
      (paginateData as jest.Mock).mockReturnValue({ data: mockCities, metadata: mockMetadata });

      const result = await cityRepository.getAll('Test', 1, 10, 'name', 'desc', {}, { name: 1 });

      expect(buildSearchQuery).toHaveBeenCalledWith('Test', CityModel);
      expect(CityModel.countDocuments).toHaveBeenCalledWith(mockQuery);
      expect(CityModel.find).toHaveBeenCalledWith(mockQuery);
      expect(CityModel.find().select).toHaveBeenCalledWith({ name: 1 });
      expect(CityModel.find().sort).toHaveBeenCalledWith({ name: -1 });
      expect(CityModel.find().skip).toHaveBeenCalledWith(0);
      expect(CityModel.find().limit).toHaveBeenCalledWith(10);
      expect(paginateData).toHaveBeenCalledWith(mockCities, 1, 10, 1);
      expect(result).toEqual({ data: mockCities, metadata: mockMetadata });
    });
  });

  describe('buildQuery', () => {
    it('should build query with search key', async () => {
      const mockQuery = { name: { $regex: 'Test', $options: 'i' } };
      (buildSearchQuery as jest.Mock).mockResolvedValue(mockQuery);

      const result = await cityRepository.buildQuery('Test');

      expect(buildSearchQuery).toHaveBeenCalledWith('Test', CityModel);
      expect(result).toEqual(mockQuery);
    });

    it('should build query with filter', async () => {
      const filter = { country: 'TestCountry' };
      const result = await cityRepository.buildQuery(undefined, filter);

      expect(buildSearchQuery).not.toHaveBeenCalled();
      expect(result).toEqual(filter);
    });
  });

  describe('getTotalCount', () => {
    it('should return total count of documents', async () => {
      (CityModel.countDocuments as jest.Mock).mockResolvedValue(5);

      const result = await cityRepository.getTotalCount({});

      expect(CityModel.countDocuments).toHaveBeenCalledWith({});
      expect(result).toEqual(5);
    });
  });

  describe('fetchCities', () => {
    it('should fetch cities with sorting and pagination', async () => {
      const mockCities = [mockCity];
      (CityModel.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCities),
      });

      const result = await cityRepository.fetchCities({}, 'name', 'asc', 1, 10, { name: 1 });

      expect(CityModel.find).toHaveBeenCalledWith({});
      expect(CityModel.find().select).toHaveBeenCalledWith({ name: 1 });
      expect(CityModel.find().sort).toHaveBeenCalledWith({ name: 1 });
      expect(CityModel.find().skip).toHaveBeenCalledWith(0);
      expect(CityModel.find().limit).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockCities);
    });
  });

  describe('buildMetadata', () => {
    it('should build metadata with pagination', () => {
      const mockCities = [mockCity];
      const mockMetadata = { totalItems: 1, totalPages: 1, currentPage: 1 };
      (paginateData as jest.Mock).mockReturnValue({ data: mockCities, metadata: mockMetadata });

      const result = cityRepository.buildMetadata(mockCities, 1, 1, 10);

      expect(paginateData).toHaveBeenCalledWith(mockCities, 1, 10, 1);
      expect(result).toEqual(mockMetadata);
    });

    it('should return empty metadata without pagination', () => {
      const result = cityRepository.buildMetadata([mockCity], 1);

      expect(paginateData).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
});