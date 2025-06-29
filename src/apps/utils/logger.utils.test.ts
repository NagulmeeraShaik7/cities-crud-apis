import Logger from './logger.utils';
import { LOGGER_PREFIX } from '../../infrasturcture/constants/city.contstants';

// Mock console methods
console.log = jest.fn();
console.error = jest.fn();

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('info', () => {
    it('should log an info message with the correct prefix', () => {
      const message = 'Test info message';
      Logger.info(message);

      expect(console.log).toHaveBeenCalledWith(`${LOGGER_PREFIX.INFO} ${message}`);
      expect(console.log).toHaveBeenCalledTimes(1);
    });

    it('should log an info message with additional arguments', () => {
      const message = 'Test info message';
      const arg1 = { key: 'value' };
      const arg2 = 42;

      Logger.info(message, arg1, arg2);

      expect(console.log).toHaveBeenCalledWith(`${LOGGER_PREFIX.INFO} ${message}`, arg1, arg2);
      expect(console.log).toHaveBeenCalledTimes(1);
    });
  });

  describe('error', () => {
    it('should log an error message with the correct prefix', () => {
      const message = 'Test error message';
      Logger.error(message);

      expect(console.error).toHaveBeenCalledWith(`${LOGGER_PREFIX.ERROR} ${message}`);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should log an error message with additional arguments', () => {
      const message = 'Test error message';
      const arg1 = new Error('Sample error');
      const arg2 = { details: 'error details' };

      Logger.error(message, arg1, arg2);

      expect(console.error).toHaveBeenCalledWith(`${LOGGER_PREFIX.ERROR} ${message}`, arg1, arg2);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });
});