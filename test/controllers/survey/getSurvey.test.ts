import { v4 as uuid } from "uuid";
import { Response, Request } from "express";
import { NotFoundError } from "objection";

import Survey from "../../../src/models/Survey";
import SurveyQuestion from "../../../src/models/SurveyQuestion";
import Question from "../../../src/models/Question";

import SurveyController from "../../../src/controllers/surveyController";
import { STATUS } from "../../../src/utils/types";

jest.mock("../../../src/models/Survey");
jest.mock("../../../src/models/Question");
jest.mock("../../../src/models/SurveyQuestion");

describe("getSurvey", () => {
  const mockSurvey = {
    id: uuid(),
    title: "title",
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  };

  const mockQuestions = [
    {
      id: uuid(),
      title: "Question One",
      componentSchemaId: "component-id@1",
      componentConfiguration: "[{}]",
    },
    {
      id: uuid(),
      title: "Question Two",
      componentSchemaId: "component-id-two@1",
      componentConfiguration: "[{}]",
    },
  ];

  const mockSurveyQuestions = mockQuestions.map((question) => ({
    questionId: question.id,
    surveyId: mockSurvey.id,
  }));

  const mockReponse = {
    status: jest.fn().mockReturnValue({ json: jest.fn() }),
  } as unknown as Response;

  const surveyController = new SurveyController();

  describe("when survey does not exist", () => {
    beforeAll(() => {
      Survey.query = jest
        .fn()
        .mockReturnValue({ findById: jest.fn().mockResolvedValue(undefined) });
    });

    it("throws a not found error", async () => {
      await expect(() =>
        surveyController.getSurvey(
          { params: { id: mockSurvey.id } } as unknown as Request,
          mockReponse
        )
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("when survey exists", () => {
    beforeAll(() => {
      Survey.transaction = jest.fn(async (callback) => {
        return await callback();
      });
      Survey.query = jest
        .fn()
        .mockReturnValue({ findById: jest.fn().mockResolvedValue(mockSurvey) });
      SurveyQuestion.query = jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(mockSurveyQuestions),
      });
      Question.query = jest.fn().mockReturnValue({
        whereIn: jest.fn().mockResolvedValue(mockQuestions),
      });
    });

    it("returns the complete survey with its questions", async () => {
      await surveyController.getSurvey(
        { params: { id: mockSurvey.id } } as unknown as Request,
        mockReponse
      );

      expect(SurveyQuestion.query().where).toHaveBeenCalledWith(
        "survey_id",
        mockSurvey.id
      );
      expect(Question.query().whereIn).toHaveBeenCalledWith(
        "id",
        mockSurveyQuestions.map((surveyQuestion) => surveyQuestion.questionId)
      );

      expect(mockReponse.status).toHaveBeenCalledWith(STATUS.OK);
      expect(mockReponse.status(STATUS.OK).json).toHaveBeenCalledWith({
        ...mockSurvey,
        questions: mockQuestions,
      });
    });
  });
});
