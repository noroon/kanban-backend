import express from "express";
import { AppDataSource, DB_PORT } from "./database/config";
import logger from "./utils/logger";

const app = express();
const port = DB_PORT || 3000;

app.use(express.json());

const main = async (): Promise<void> => {
  await AppDataSource.initialize();

  app
    .listen(port, () => {
      logger.info(`Server is listening on port: ${port}`);
    })
    .on("error", (error) => {
      logger.error(error.message);
    });
};

main().catch(console.error);
