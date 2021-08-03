import express from "express";
import { body, oneOf, param } from "express-validator";

import SurveyController from "../controllers/surveyController";
import requestValidationMiddleware from "../middleware/requestValidationMiddleware";

const surveyController = new SurveyController();
const surveyRoutes = express.Router();

surveyRoutes.post(
  "/Survey",
  [
    body("title").isString(),
    oneOf([body("questions").isArray(), body("questions").isEmpty()]),
  ],
  requestValidationMiddleware,
  surveyController.createSurvey
);

surveyRoutes.get(
  "/Survey/:id",
  [param("id").isUUID()],
  requestValidationMiddleware,
  surveyController.getSurvey
);

surveyRoutes.post(
  "/Survey/:id/Answer",
  [param("id").isUUID()],
  requestValidationMiddleware,
  surveyController.createSurveyQuestionAnswers
);

surveyRoutes.get(
  "/Survey/:id/Answer",
  [param("id").isUUID()],
  requestValidationMiddleware,
  surveyController.getSurveyQuestionAnswers
);

export default surveyRoutes;
