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
    console.log(`[INFO] ${message}`, ...args);
  }

  /**
   * Logs an error message.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   */
  static error(message: string, ...args: any[]) {
    console.error(`[ERROR] ${message}`, ...args);
  }
}