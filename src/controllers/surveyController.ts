import { Request, Response } from "express";
import { NotFoundError, ValidationError } from "objection";

import { STATUS } from "../utils/types";
import { getHostUrl } from "../utils/helpers";
import {
  CreateSurveyBody,
  CreateSurveyAnswerBody,
} from "./types/SurveyRequests";

import Survey from "../models/Survey";
import SurveyOwner from "../models/SurveyOwner";
import Question from "../models/Question";
import SurveyQuestion from "../models/SurveyQuestion";
import Answer from "../models/Answer";
import SurveyAnswer from "../models/SurveyAnswer";

class SurveyController {
  private static async _validateSurveyExists(id: string): Promise<void> {
    const survey = await Survey.query().findById(id);

    if (!survey) {
      throw new ValidationError({
        type: "Request Validation",
        message: "Survey does not exist",
      });
    }
  }

  async createSurvey(
    request: Request<{}, {}, CreateSurveyBody>,
    response: Response
  ): Promise<void> {
    const { title, questions = [] } = request.body;

    const createdSurvey = await Survey.transaction(async () => {
      const survey = await Survey.query().insert({ title });

      await SurveyOwner.query().insert({
        surveyId: survey.id,
        // ryan@test.com, hardcoded for testing
        userId: "427de2f7-3aed-46a5-9cbf-c871354bed32",
      });

      if (questions.length > 0) {
        const insertedQuestions = await Question.query().insert(
          questions.map((question) => ({
            title: question.title,
            componentSchemaId: question.componentSchemaId,
            componentConfiguration: question.componentConfiguration,
          }))
        );

        const surveyQuestions = insertedQuestions.map((insertedQuestion) => ({
          surveyId: survey.id,
          questionId: insertedQuestion.id,
        }));

        await SurveyQuestion.query().insert(surveyQuestions);
      }

      return survey;
    });

    response
      .status(STATUS.CREATED)
      .json({ url: `${getHostUrl()}/Survey/${createdSurvey.id}` });
  }

  async getSurvey(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    const survey = await Survey.query().findById(id);

    if (!survey) {
      throw new NotFoundError({ message: "Survey not found" });
    }

    const questions = await Survey.transaction(async () => {
      const surveyQuestions = await SurveyQuestion.query().where(
        "survey_id",
        id
      );

      return await Question.query().whereIn(
        "id",
        surveyQuestions.map((surveyQuestion) => surveyQuestion.questionId)
      );
    });

    response.status(STATUS.OK).json({ ...survey, questions });
  }

  async createSurveyQuestionAnswers(
    request: Request<{ id: string }, {}, CreateSurveyAnswerBody>,
    response: Response
  ): Promise<void> {
    const { id } = request.params;

    await SurveyController._validateSurveyExists(id);

    await Answer.transaction(async () => {
      const answers = request.body;

      const insertedAnswers = await Answer.query().insert(answers);

      await SurveyAnswer.query().insert(
        (insertedAnswers as unknown as Answer[]).map((answer) => ({
          answerId: answer.id,
          surveyId: id,
        }))
      );
    });

    response.status(STATUS.CREATED).send();
  }

  async getSurveyQuestionAnswers(
    request: Request<{ id: string }, {}, {}>,
    response: Response
  ): Promise<void> {
    const { id } = request.params;

    await SurveyController._validateSurveyExists(id);

    const answers = await Survey.transaction(async () => {
      const surveyAnswers = await SurveyAnswer.query().where("survey_id", id);

      return await Answer.query()
        .whereIn(
          "id",
          surveyAnswers.map((surveyAnswer) => surveyAnswer.answerId)
        )
        .withGraphFetched("user")
        .withGraphFetched("question");
    });

    response.status(STATUS.OK).json(answers);
  }
}

export default SurveyController;
