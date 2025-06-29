import { LOGGER_PREFIX } from "../../infrasturcture/constants/city.contstants";

/**
 * Simple logger utility for demonstration purposes.
 */
export default class Logger {
  /**
   * Logs an info message.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   */
  static info(message: string, ...args: any[]) {
    console.log(`${LOGGER_PREFIX.INFO} ${message}`, ...args);
  }

  /**
   * Logs an error message.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   */
  static error(message: string, ...args: any[]) {
    console.error(`${LOGGER_PREFIX.ERROR} ${message}`, ...args);
  }
}
