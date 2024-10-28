import { DataSource } from "typeorm";
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  NODE_ENV,
} from "../utils/dotenv.config";

export default new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: "file",
  entities: ["src/entities/*.entity{.ts,.js}"],
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: "migration_table",
});
