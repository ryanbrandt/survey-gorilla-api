import express from "express";
import { param } from "express-validator";

import UserController from "../controllers/userController";
import requestValidationMiddleware from "../middleware/requestValidationMiddleware";

const userController = new UserController();
const userRoutes = express.Router();

userRoutes.get(
  "/User/:id/Survey",
  [param("id").isUUID()],
  requestValidationMiddleware,
  userController.getUserOwnedSurveys
);

export default userRoutes;
