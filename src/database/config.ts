import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, NODE_ENV } = process.env;

const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: NODE_ENV === "development" ? true : false,
  logging: NODE_ENV === "development" ? true : false,
});

export { AppDataSource, DB_PORT };
