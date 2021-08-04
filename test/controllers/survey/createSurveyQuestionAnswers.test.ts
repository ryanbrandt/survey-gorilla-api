import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import { ValidationError } from "objection";

import Survey from "../../../src/models/Survey";
import Answer from "../../../src/models/Answer";
import SurveyAnswer from "../../../src/models/SurveyAnswer";

import SurveyController from "../../../src/controllers/surveyController";
import { CreateSurveyAnswerBody } from "../../../src/controllers/types/SurveyRequests";
import { STATUS } from "../../../src/utils/types";

jest.mock("../../../src/models/Survey");
jest.mock("../../../src/models/Answer");
jest.mock("../../../src/models/SurveyAnswer");

describe("createSurveyQuestionAnswers", () => {
  const mockCreateAnswersBody: CreateSurveyAnswerBody = [
    {
      userId: uuid(),
      questionId: uuid(),
      values: {},
    },
    {
      userId: uuid(),
      questionId: uuid(),
      values: {},
    },
  ];

  const mockReponse = {
    status: jest.fn().mockReturnValue({ send: jest.fn() }),
  } as unknown as Response;

  const mockRequest = {
    params: { id: uuid() },
    body: mockCreateAnswersBody,
  } as unknown as Request<{ id: string }, {}, CreateSurveyAnswerBody>;

  const surveyController = new SurveyController();

  describe("when survey does not exist", () => {
    beforeAll(() => {
      Survey.query = jest
        .fn()
        .mockReturnValue({ findById: jest.fn().mockResolvedValue(undefined) });
    });

    it("throws a validation error", async () => {
      await expect(() =>
        surveyController.createSurveyQuestionAnswers(mockRequest, mockReponse)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("when survey exists", () => {
    const mockCreatedAnswers = [{ id: uuid() }, { id: uuid() }];

    beforeAll(() => {
      Survey.query = jest.fn().mockReturnValue({
        findById: jest.fn().mockResolvedValue({ id: uuid() }),
      });
      Answer.transaction = jest.fn(async (callback) => {
        return await callback();
      });
      Answer.query = jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockCreatedAnswers),
      });
      SurveyAnswer.query = jest.fn().mockReturnValue({ insert: jest.fn() });
    });

    it("creates all answers and survey answers", async () => {
      await surveyController.createSurveyQuestionAnswers(
        mockRequest,
        mockReponse
      );

      expect(Answer.query().insert).toHaveBeenCalledWith(mockCreateAnswersBody);
      expect(SurveyAnswer.query().insert).toHaveBeenCalledWith(
        mockCreatedAnswers.map((answer) => ({
          answerId: answer.id,
          surveyId: mockRequest.params.id,
        }))
      );

      expect(mockReponse.status).toHaveBeenCalledWith(STATUS.CREATED);
      expect(mockReponse.status(STATUS.CREATED).send).toHaveBeenCalled();
    });
  });
});
