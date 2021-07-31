import { Request, Response } from "express";
import { NotFoundError, ValidationError } from "objection";

import Survey from "../models/Survey";
import { STATUS } from "../utils/types";
import SurveyOwner from "../models/SurveyOwner";
import { getHostUrl } from "../utils/helpers";
import Question from "../models/Question";
import SurveyQuestions from "../models/SurveyQuestions";
import SurveyQuestion from "../models/SurveyQuestions";
import Answer from "models/Answer";

interface CreateSurveyBody {
  title: string;
  ownerId: string;
}

interface CreateQuestionBody {
  title: string;
  ownerId: string;
  componentSchemaId: string;
  componentConfiguration: string;
}

type CreateSurveyQuestionsBody = Array<CreateQuestionBody>;

interface CreateAnswerBody {
  userId: string;
  questionId: string;
  values: object;
}

type CreateSurveyAnswerBody = Array<CreateAnswerBody>;

class SurveyController {
  private async _validateSurveyExists(id: string): Promise<void> {
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
    const { title } = request.body;

    const createdSurvey = await Survey.transaction(async () => {
      const survey = await Survey.query().insert({ title });

      // ryan@test.com
      const ownerId = "9c400e89-ae58-41b7-9428-0281aae7447e";

      await SurveyOwner.query().insert({
        surveyId: survey.id,
        userId: ownerId,
      });

      return survey;
    });

    response
      .status(STATUS.CREATED)
      .send({ url: `${getHostUrl()}/Survey/${createdSurvey.id}` });
  }

  async getSurvey(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    const survey = await Survey.query().findById(id);

    if (!survey) {
      throw new NotFoundError({ message: "Survey not found" });
    }

    response.status(STATUS.OK).json(survey);
  }

  async createSurveyQuestions(
    request: Request<{ id: string }, {}, CreateSurveyQuestionsBody>,
    response: Response
  ): Promise<void> {
    const { id } = request.params;

    await this._validateSurveyExists(id);

    await Question.transaction(async () => {
      const { body: questions } = request;
      const insertedQuestions = await Question.query().insert(questions);

      const surveyQuestions = insertedQuestions.map((insertedQuestion) => ({
        surveyId: id,
        questionId: insertedQuestion.id,
      }));

      await SurveyQuestions.query().insert(surveyQuestions);
    });

    response
      .status(STATUS.CREATED)
      .send({ url: `${getHostUrl()}/${id}/Question` });
  }

  async getSurveyQuestions(
    request: Request,
    response: Response
  ): Promise<void> {
    const { id } = request.params;

    const questions = await Question.transaction(async () => {
      const surveyQuestions = await SurveyQuestion.query().where(
        "survey_id",
        id
      );

      return Question.query().whereIn(
        "id",
        surveyQuestions.map((surveyQuestion) => surveyQuestion.questionId)
      );
    });

    response.status(STATUS.OK).json(questions);
  }

  async createSurveyQuestionAnswers(
    request: Request<{ id: string }, {}, CreateSurveyAnswerBody>,
    response: Response
  ): Promise<void> {
    const { id } = request.params;

    await this._validateSurveyExists(id);

    await Answer.transaction(async () => {
      const answers = request.body;

      const insertedAnswers = await Answer.query().insert(answers);
    });

    response.status(STATUS.CREATED).send();
  }
}

export default SurveyController;
