import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import cache from "memory-cache";
import createHttpError from "http-errors";
import AppDataSource from "../database/data-source";
import { User } from "../entities/user.entity";
import encrypt from "../utils/encrypt";
import logger from "../utils/logger";

interface CustomRequest extends Request {
  currentUser: User | JwtPayload;
}

const userController = {
  async signup(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const isEmailAvailable = !(await userRepository.findOne({
        where: { email },
      }));

      if (isEmailAvailable) {
        const encryptedPassword = await encrypt.encryptpass(password);
        const user = new User();
        user.username = username;
        user.email = email;
        user.password = encryptedPassword;

        await userRepository.save(user);

        const token = encrypt.generateToken({
          id: user.id,
          username: user.username,
          role: user.role,
        });
        res.status(200).json({ message: "User created successfully", token });
      } else {
        throw createHttpError(404, { error: "Email already taken" }); // 404?
      }
    } catch (error) {
      logger.error(error);
      throw createHttpError(500, { error });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw createHttpError(500, { error: "Email and password required" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        throw createHttpError(404, { error: "User not found" });
      }

      const isPasswordValid = encrypt.comparepassword(user.password, password);
      if (!isPasswordValid) {
        throw createHttpError(404, { error: "Password is not valid" });
      }

      const token = encrypt.generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      logger.error(error);
      throw createHttpError(500, { error });
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      if (!(req as CustomRequest).currentUser) {
        throw createHttpError(401, { error: "Unauthorized" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: (req as CustomRequest).currentUser.id },
      });
      res.status(200).json({ ...user, password: undefined });
    } catch (error) {
      logger.error(error);
      throw createHttpError(500, { error });
    }
  },

  async getUsers(_req: Request, res: Response) {
    const data = cache.get("data");

    if (data) {
      logger.info("Serving from cache");

      res.status(200).json({
        data,
      });
    } else {
      try {
        logger.info("Serving from db");

        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();

        cache.put("data", users, 6000);
        res.status(200).json({
          data: users,
        });
      } catch (error) {
        logger.error(error);
        throw createHttpError(500, { error });
      }
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, email, password } = req.body;
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { id },
      });

      const updatedUser = { ...user, username, email };

      if (!!password) {
        const encryptedPassword = await encrypt.encryptpass(password);
        updatedUser.password = encryptedPassword;
      }

      await userRepository.save(updatedUser);
      const token = encrypt.generateToken({
        id: user!.id,
        username: user!.username,
        role: user!.role,
      });

      res.status(200).json({ message: "User udpdated successfully", token });
    } catch (error) {
      logger.error(error);
      throw createHttpError(500, { error });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id },
      });

      await userRepository.remove(user!);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      logger.error(error);
      throw createHttpError(500, { error });
    }
  },
};

export default userController;
