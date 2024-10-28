import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";
import { JWT_SECRET } from "../utils/dotenv.config";

interface CustomRequest extends Request {
  currentUser: string | JwtPayload;
}

const authentication = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      throw createHttpError(401, { error: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    if (!token) {
      throw createHttpError(401, { error: "Unauthorized" });
    }

    const decode = jwt.verify(token, JWT_SECRET);
    if (!decode) {
      throw createHttpError(401, { error: "Unauthorized" });
    }

    (req as CustomRequest).currentUser = decode;

    next();
  } catch (error) {
    next(createHttpError(401, { status: "error", message: "Invalid token" }));
  }
};

export default authentication;
