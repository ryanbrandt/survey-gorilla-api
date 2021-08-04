import { v4 as uuid } from "uuid";
import { Response, Request } from "express";

import SurveyController from "../../../src/controllers/surveyController";

import Survey from "../../../src/models/Survey";
import SurveyOwner from "../../../src/models/SurveyOwner";
import Question from "../../../src/models/Question";
import SurveyQuestion from "../../../src/models/SurveyQuestion";

import { getHostUrl } from "../../../src/utils/helpers";
import { CreateSurveyBody } from "../../../src/controllers/types/SurveyRequests";
import { STATUS } from "../../../src/utils/types";
import { CreateQuestionBody } from "../../../src/controllers/types/QuestionRequests";

jest.mock("../../../src/models/Survey");
jest.mock("../../../src/models/SurveyOwner");
jest.mock("../../../src/models/Question");
jest.mock("../../../src/models/SurveyQuestion");
jest.mock("../../../src/utils/helpers");

const mockGetHostUrl = getHostUrl as jest.MockedFunction<typeof getHostUrl>;

describe("createSurvey", () => {
  const mockUrl = "http://some-url.com";
  const mockTitle = "title";
  const mockSurvey = {
    id: uuid(),
    title: mockTitle,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  };

  const mockCreateSurveyBody: CreateSurveyBody = {
    ownerId: uuid(),
    title: mockTitle,
    questions: [],
  };

  const mockQuestions = [
    {
      id: uuid(),
      title: "Question One",
      ownerId: mockCreateSurveyBody.ownerId,
      componentSchemaId: "component-id@1",
      componentConfiguration: "[{}]",
    },
    {
      id: uuid(),
      title: "Question Two",
      ownerId: mockCreateSurveyBody.ownerId,
      componentSchemaId: "component-id-two@1",
      componentConfiguration: "[{}]",
    },
  ];

  const mockCreateQuestionsBody: Array<CreateQuestionBody> = mockQuestions.map(
    ({ title, ownerId, componentSchemaId, componentConfiguration }) => ({
      title,
      ownerId,
      componentSchemaId,
      componentConfiguration,
    })
  );

  const mockReponse = {
    status: jest.fn().mockReturnValue({ json: jest.fn() }),
  } as unknown as Response;

  beforeEach(() => {
    Survey.transaction = jest.fn(async (callback) => {
      return await callback();
    });
    Survey.query = jest
      .fn()
      .mockReturnValue({ insert: jest.fn().mockResolvedValue(mockSurvey) });
    Question.query = jest
      .fn()
      .mockReturnValue({ insert: jest.fn().mockResolvedValue(mockQuestions) });
    SurveyQuestion.query = jest.fn().mockReturnValue({ insert: jest.fn() });
    SurveyOwner.query = jest.fn().mockReturnValue({ insert: jest.fn() });
    mockGetHostUrl.mockReturnValue(mockUrl);
  });

  const surveyController = new SurveyController();

  it("creates a new survey and survey owner with the provided title and userId", async () => {
    await surveyController.createSurvey(
      { body: mockCreateSurveyBody } as unknown as Request<
        {},
        {},
        CreateSurveyBody
      >,
      mockReponse
    );

    expect(Survey.query().insert).toHaveBeenCalledWith({ title: mockTitle });
    expect(SurveyOwner.query().insert).toHaveBeenCalledWith({
      surveyId: mockSurvey.id,
      userId: expect.any(String),
    });
    expect(Question.query().insert).not.toHaveBeenCalled();
    expect(SurveyQuestion.query().insert).not.toHaveBeenCalled();

    expect(mockReponse.status).toHaveBeenCalledWith(STATUS.CREATED);
    expect(mockReponse.status(STATUS.CREATED).json).toHaveBeenCalledWith({
      url: `${mockUrl}/Survey/${mockSurvey.id}`,
    });
  });

  it("creates the questions and survey questions if questions are provided", async () => {
    const mockCreateSurveyBodyWithQuestions: CreateSurveyBody = {
      ...mockCreateSurveyBody,
      questions: mockCreateQuestionsBody,
    };

    await surveyController.createSurvey(
      { body: mockCreateSurveyBodyWithQuestions } as unknown as Request<
        {},
        {},
        CreateSurveyBody
      >,
      mockReponse
    );

    expect(Survey.query().insert).toHaveBeenCalledWith({ title: mockTitle });
    expect(SurveyOwner.query().insert).toHaveBeenCalledWith({
      surveyId: mockSurvey.id,
      userId: expect.any(String),
    });

    expect(Question.query().insert).toHaveBeenLastCalledWith(
      mockQuestions.map((question) => ({
        title: question.title,
        componentSchemaId: question.componentSchemaId,
        componentConfiguration: question.componentConfiguration,
      }))
    );
    expect(SurveyQuestion.query().insert).toHaveBeenCalledWith(
      mockQuestions.map((question) => ({
        surveyId: mockSurvey.id,
        questionId: question.id,
      }))
    );

    expect(mockReponse.status).toHaveBeenCalledWith(STATUS.CREATED);
    expect(mockReponse.status(STATUS.CREATED).json).toHaveBeenCalledWith({
      url: `${mockUrl}/Survey/${mockSurvey.id}`,
    });
  });
});
