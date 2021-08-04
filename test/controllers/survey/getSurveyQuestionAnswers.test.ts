import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import { ValidationError } from "objection";

import Survey from "../../../src/models/Survey";
import SurveyAnswer from "../../../src/models/SurveyAnswer";
import Answer from "../../../src/models/Answer";

import SurveyController from "../../../src/controllers/surveyController";
import { STATUS } from "../../../src/utils/types";

jest.mock("../../../src/models/Survey");
jest.mock("../../../src/models/SurveyAnswer");
jest.mock("../../../src/models/Answer");

describe("getSurveyQuestionAnswers", () => {
  const mockReponse = {
    status: jest.fn().mockReturnValue({ json: jest.fn() }),
  } as unknown as Response;

  const mockRequest = {
    params: { id: uuid() },
  } as unknown as Request<{ id: string }, {}, {}>;

  const surveyController = new SurveyController();

  describe("when survey does not exist", () => {
    beforeAll(() => {
      Survey.query = jest
        .fn()
        .mockReturnValue({ findById: jest.fn().mockResolvedValue(undefined) });
    });

    it("throws a validation error", async () => {
      await expect(() =>
        surveyController.getSurveyQuestionAnswers(mockRequest, mockReponse)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("when survey exists", () => {
    const mockSurveyAnswers = [{ answerId: uuid() }, { answerId: uuid() }];

    beforeAll(() => {
      Survey.query = jest.fn().mockReturnValue({
        findById: jest.fn().mockResolvedValue({ id: uuid() }),
      });
      Survey.transaction = jest
        .fn()
        .mockImplementation(async (callback) => await callback());
      SurveyAnswer.query = jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(mockSurveyAnswers),
      });
      Answer.query = jest.fn().mockReturnValue({
        whereIn: jest.fn().mockReturnThis(),
        withGraphFetched: jest.fn().mockReturnThis(),
      });
    });

    it("returns all of the survey's answers joined with the question and user", async () => {
      await surveyController.getSurveyQuestionAnswers(mockRequest, mockReponse);

      expect(SurveyAnswer.query().where).toHaveBeenCalledWith(
        "survey_id",
        mockRequest.params.id
      );
      expect(Answer.query().whereIn).toHaveBeenCalledWith(
        "id",
        mockSurveyAnswers.map((surveyAnswer) => surveyAnswer.answerId)
      );
      expect(Answer.query().withGraphFetched).toHaveBeenCalledWith("user");
      expect(Answer.query().withGraphFetched).toHaveBeenCalledWith("question");

      expect(mockReponse.status).toHaveBeenCalledWith(STATUS.OK);
      expect(mockReponse.status(STATUS.OK).json).toHaveBeenCalledWith(
        Answer.query().withGraphFetched("")
      );
    });
  });
});
