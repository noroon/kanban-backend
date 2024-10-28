import express from "express";
import "reflect-metadata";
import AppDataSource from "./database/data-source";
import { PORT } from "./utils/dotenv.config";
import logger from "./utils/logger";
import { userRouter } from "./routes/user.routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
const port = PORT || 3000;

app.use("/api", userRouter);
app.use(errorHandler);

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
