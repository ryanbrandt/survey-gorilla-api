import express from "express";
import { body } from "express-validator";

import SurveyController from "../controllers/surveyController";
import validateRequest from "../middleware/validateRequest";

const surveyController = new SurveyController();
const surveyRoutes = express.Router();

surveyRoutes.post(
  "/Survey",
  [],
  validateRequest,
  surveyController.createSurvey
);

surveyRoutes.get(
  "/Survey/:id",
  [],
  validateRequest,
  surveyController.getSurvey
);

surveyRoutes.post(
  "/Survey/:id/Answer",
  [],
  validateRequest,
  surveyController.createSurveyQuestionAnswers
);

surveyRoutes.get(
  "/Survey/:id/Answer",
  [],
  validateRequest,
  surveyController.getSurveyQuestionAnswers
);

export default surveyRoutes;
