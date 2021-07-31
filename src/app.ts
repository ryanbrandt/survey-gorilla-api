import express, { Express } from "express";
import { json } from "body-parser";
import cors from "cors";

import errorMiddleware from "./middleware/errorMiddleware";
import surveyRoutes from "./routes/surveyRoutes";

const app = express();

export const applyMiddleware = (app: Express): void => {
  app.use(json());
  app.use(cors());
};

applyMiddleware(app);

app.use(surveyRoutes);

app.use(errorMiddleware);

export { app };
