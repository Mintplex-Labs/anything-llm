const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, origin }) => {
          return `\x1b[36m[${origin}]\x1b[0m ${level}: ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: "app.log",
      format: winston.format.combine(
        winston.format.printf(({ level, message, origin }) => {
          return `[${origin}] ${level}: ${message}`;
        })
      ),
    }),
  ],
});

module.exports = logger;
