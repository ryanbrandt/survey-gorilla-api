import express, { Express } from "express";
import { json } from "body-parser";
import cors from "cors";

const app = express();

export const applyMiddleware = (app: Express): void => {
  app.use(json());
  app.use(cors());
};

applyMiddleware(app);

export { app };
