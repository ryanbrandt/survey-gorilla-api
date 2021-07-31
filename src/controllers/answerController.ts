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

interface CreateAnswerBody {
  userId: string;
  questionId: string;
  surveyId: string;
  values: object;
}

class AnswerController {
  async createAnswer(
    request: Request<{}, {}, CreateAnswerBody>,
    response: Response
  ): Promise<void> {
    const { userId, questionId, values } = request.body;

    const answer = Answer.transaction(async () => {
      const createdAnswer = await Answer.query().insert({
        userId,
        questionId,
        values,
      });
    });
  }
}
