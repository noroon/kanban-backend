import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";
import AppDataSource from "../database/data-source";
import { User } from "../entities/user.entity";

interface CustomRequest extends Request {
  currentUser: User | JwtPayload;
}

const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: (req as CustomRequest).currentUser.id },
    });

    if (user && !roles.includes(user.role)) {
      throw createHttpError(403, { error: "Forbidden" });
    }

    next();
  };
};

export default authorization;
