const winston = require("winston");

class Logger {
  logger = console;
  static _instance;
  constructor() {
    if (Logger._instance) return Logger._instance;
    this.logger =
      process.env.NODE_ENV === "production" ? this.getWinstonLogger() : console;
    Logger._instance = this;
  }

  getWinstonLogger() {
    const logger = winston.createLogger({
      level: "info",
      defaultMeta: { service: "backend" },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              ({ level, message, service, origin = "" }) => {
                return `\x1b[36m[${service}]\x1b[0m${origin ? `\x1b[33m[${origin}]\x1b[0m` : ""} ${level}: ${message}`;
              }
            )
          ),
        }),
      ],
    });

    console.log = function () {
      return logger.info.apply(logger, arguments);
    };
    console.error = function () {
      return logger.error.apply(logger, arguments);
    };
    console.info = function () {
      return logger.warn.apply(logger, arguments);
    };
    return logger;
  }
}

/**
 * Sets and overrides Console methods for logging when called.
 * This is a singleton method and will not create multiple loggers.
 * @returns {winston.Logger | console} - instantiated logger interface.
 */
function setLogger() {
  return new Logger().logger;
}
module.exports = setLogger;
