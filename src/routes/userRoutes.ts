import express from "express";
import { body } from "express-validator";

import UserController from "../controllers/userController";
import validateRequest from "../middleware/validateRequest";

const userController = new UserController();
const userRoutes = express.Router();

userRoutes.get(
  "/User/:id/Survey",
  [],
  validateRequest,
  userController.getUserOwnedSurveys
);

export default userRoutes;
