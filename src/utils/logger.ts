import { format, createLogger, transports } from "winston";

const options = {
  file: {
    level: "info",
    handleExceptions: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
    json: true,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    format: format.combine(format.colorize(), format.simple()),
  },
};

const logger = createLogger({
  exitOnError: false,
  handleRejections: true,
  transports: [
    Object.assign(
      new transports.File({
        ...options.file,
        filename: "logs/error.log",
        level: "error",
      }),
      { handleRejections: true }
    ),
    new transports.File({
      ...options.file,
      filename: "logs/app.log",
    }),
  ],
});

export const stream = {
  write: (message: string): void => {
    logger.info(message);
  },
};

if (process.env.NODE_ENV !== "production") {
  logger.add(
    Object.assign(new transports.Console(options.console), {
      handleRejections: true,
    })
  );
}

export default logger;
