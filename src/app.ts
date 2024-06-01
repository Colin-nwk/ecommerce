import express, { Express } from "express";

import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();

app.use(express.json());
app.use("/api/", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["error", "warn"],
});

app.use(errorMiddleware);

export default app;
