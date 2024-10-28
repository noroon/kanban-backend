import "dotenv/config";
import { Secret } from "jsonwebtoken";

type envData = Omit<NodeJS.ProcessEnv, "DB_PORT" | "PORT" | "JWT_SECRET"> & {
  DB_PORT: number;
  PORT: number;
  JWT_SECRET: Secret;
};

export const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  NODE_ENV,
  PORT,
  JWT_SECRET,
} = process.env as envData;
