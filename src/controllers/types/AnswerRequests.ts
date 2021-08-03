export interface CreateAnswerBody {
  userId: string;
  questionId: string;
  surveyId?: string;
  values: object;
}
