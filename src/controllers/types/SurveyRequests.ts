import { CreateAnswerBody } from "./AnswerRequests";
import { CreateQuestionBody } from "./QuestionRequests";

export interface CreateSurveyBody {
  title: string;
  ownerId: string;
  questions?: Array<Omit<CreateQuestionBody, "ownerId">>;
}

export type CreateSurveyAnswerBody = Array<Omit<CreateAnswerBody, "surveyId">>;
