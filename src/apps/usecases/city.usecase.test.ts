import { CityUsecase } from './city.usecase';
import { CityRepository } from '../repositories/city.repository';
import { ICity } from '../models/city.model';
import { CITY_ERRORS } from '../../infrasturcture/constants/city.contstants';

// Mock the CityRepository
jest.mock('../repositories/city.repository');

describe('CityUsecase', () => {
  let cityUsecase: CityUsecase;
  let cityRepository: jest.Mocked<CityRepository>;
  const mockCity = {
    _id: '1',
    name: 'Test City',
    population: 100000,
    country: 'Test Country',
    latitude: 0,
    longitude: 0,
  } as Partial<ICity>;

  beforeEach(() => {
    cityRepository = new CityRepository() as jest.Mocked<CityRepository>;
    cityUsecase = new CityUsecase();
    // Override the repository instance in the use case with the mocked version
    cityUsecase.repository = cityRepository;
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with a CityRepository instance', () => {
      const usecase = new CityUsecase();
      expect(usecase.repository).toBeInstanceOf(CityRepository);
    });
  });

  describe('addCity', () => {
    it('should create a new city if name is unique', async () => {
      cityRepository.findByName.mockResolvedValue(null);
      cityRepository.create.mockResolvedValue(mockCity as ICity);

      const result = await cityUsecase.addCity(mockCity);

      expect(cityRepository.findByName).toHaveBeenCalledWith(mockCity.name);
      expect(cityRepository.create).toHaveBeenCalledWith(mockCity);
      expect(result).toEqual(mockCity);
    });

    it('should throw an error if city name already exists', async () => {
      cityRepository.findByName.mockResolvedValue(mockCity as ICity);

      await expect(cityUsecase.addCity(mockCity)).rejects.toThrow(CITY_ERRORS.NAME_UNIQUE);
      expect(cityRepository.findByName).toHaveBeenCalledWith(mockCity.name);
      expect(cityRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateCity', () => {
    it('should update a city if it exists and new name is unique', async () => {
      const updatedCityData = { name: 'Updated City' };
      const updatedCity = { ...mockCity, name: 'Updated City' };
      cityRepository.findById.mockResolvedValue(mockCity as ICity);
      cityRepository.findByName.mockResolvedValue(null);
      cityRepository.update.mockResolvedValue(updatedCity as ICity);

      const result = await cityUsecase.updateCity('1', updatedCityData);

      expect(cityRepository.findById).toHaveBeenCalledWith('1');
      expect(cityRepository.findByName).toHaveBeenCalledWith('Updated City');
      expect(cityRepository.update).toHaveBeenCalledWith('1', updatedCityData);
      expect(result).toEqual(updatedCity);
    });

    it('should throw an error if city is not found', async () => {
      cityRepository.findById.mockResolvedValue(null);

      await expect(cityUsecase.updateCity('1', { name: 'Updated City' })).rejects.toThrow(CITY_ERRORS.NOT_FOUND);
      expect(cityRepository.findById).toHaveBeenCalledWith('1');
      expect(cityRepository.findByName).not.toHaveBeenCalled();
      expect(cityRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if new name already exists', async () => {
      const updatedCityData = { name: 'Existing City' };
      cityRepository.findById.mockResolvedValue(mockCity as ICity);
      cityRepository.findByName.mockResolvedValue({ ...mockCity   , _id: '2', name: 'Existing City' } as ICity);

      await expect(cityUsecase.updateCity('1', updatedCityData)).rejects.toThrow(CITY_ERRORS.NAME_UNIQUE);
      expect(cityRepository.findById).toHaveBeenCalledWith('1');
      expect(cityRepository.findByName).toHaveBeenCalledWith('Existing City');
      expect(cityRepository.update).not.toHaveBeenCalled();
    });

    it('should update city without checking name if name is unchanged', async () => {
      const updatedCityData = { population: 200000 };
      const updatedCity = { ...mockCity, population: 200000 };
      cityRepository.findById.mockResolvedValue(mockCity as ICity);
      cityRepository.update.mockResolvedValue(updatedCity as ICity);

      const result = await cityUsecase.updateCity('1', updatedCityData);

      expect(cityRepository.findById).toHaveBeenCalledWith('1');
      expect(cityRepository.findByName).not.toHaveBeenCalled();
      expect(cityRepository.update).toHaveBeenCalledWith('1', updatedCityData);
      expect(result).toEqual(updatedCity);
    });
  });

  describe('deleteCity', () => {
    it('should delete a city if it exists', async () => {
      cityRepository.findById.mockResolvedValue(mockCity as ICity);
      cityRepository.delete.mockResolvedValue(mockCity as ICity);

      await cityUsecase.deleteCity('1');

      expect(cityRepository.findById).toHaveBeenCalledWith('1');
      expect(cityRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if city is not found', async () => {
      cityRepository.findById.mockResolvedValue(null);

      await expect(cityUsecase.deleteCity('1')).rejects.toThrow(CITY_ERRORS.NOT_FOUND);
      expect(cityRepository.findById).toHaveBeenCalledWith('1');
      expect(cityRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should retrieve all cities with provided parameters', async () => {
      const mockCities = [mockCity];
      const mockResult = { data: mockCities, metadata: { totalItems: 1, totalPages: 1, currentPage: 1 } };
      cityRepository.getAll.mockResolvedValue(mockResult as any);

      const result = await cityUsecase.getAll('Test', 1, 10, 'name', 'desc', {}, { name: 1 });

      expect(cityRepository.getAll).toHaveBeenCalledWith('Test', 1, 10, 'name', 'desc', {}, { name: 1 });
      expect(result).toEqual(mockResult);
    });

    it('should retrieve all cities with default parameters', async () => {
      const mockCities = [mockCity];
      const mockResult = { data: mockCities, metadata: {} };
      cityRepository.getAll.mockResolvedValue(mockResult as any);

      const result = await cityUsecase.getAll();

      expect(cityRepository.getAll).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
      expect(result).toEqual(mockResult);
    });
  });
});