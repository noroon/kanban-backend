import { Request, Response } from "express";
import logger from "../utils/logger";

interface ResponseError extends Error {
  status?: number;
}

export default (err: ResponseError, req: Request, res: Response): void => {
  logger.error(
    `${err.status || 500} - ${err.name}: ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
  res.status(err.status || 500);
  res.json({
    message:
      req.app.get("env") === "development" || req.app.get("env") === "test"
        ? err.message
        : "Unknown error happened",
  });
};
