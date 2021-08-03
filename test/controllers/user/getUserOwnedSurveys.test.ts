import { Response, Request } from "express";

import UserController from "../../../src/controllers/userController";

import User from "../../../src/models/User";
import Survey from "../../../src/models/Survey";
import SurveyOwner from "../../../src/models/SurveyOwner";
import { STATUS } from "../../../src/utils/types";

jest.mock("../../../src/models/User");
jest.mock("../../../src/models/Survey");
jest.mock("../../../src/models/SurveyOwner");

describe("getUserOwnedSurveys", () => {
  const mockUserId = "user ID";

  const mockSurveyIdOne = "ID1";
  const mockSurveyIdTwo = "ID2";
  const mockSurveyOwners = [
    { surveyId: mockSurveyIdOne, userId: mockUserId },
    { surveyId: mockSurveyIdTwo, userId: mockUserId },
  ];

  const mockSurveys = [
    {
      id: mockSurveyIdOne,
      title: "title 1",
      created: "some date",
      modified: "some different date",
    },
    {
      id: mockSurveyIdTwo,
      title: "title 2",
      created: "some other date",
      modified: "some other different date",
    },
  ];

  const mockReponse = {
    status: jest.fn().mockReturnValue({ json: jest.fn() }),
  } as unknown as Response;

  const mockRequest = {
    params: {
      id: mockUserId,
    },
  } as unknown as Request;

  beforeAll(() => {
    User.transaction = jest.fn(async (callback) => await callback());
    SurveyOwner.query = jest
      .fn()
      .mockReturnValue({ where: jest.fn().mockReturnValue(mockSurveyOwners) });
    Survey.query = jest
      .fn()
      .mockReturnValue({ whereIn: jest.fn().mockReturnValue(mockSurveys) });
  });

  const userController = new UserController();

  it("returns a list of all user owned survey for the specified id", async () => {
    await userController.getUserOwnedSurveys(mockRequest, mockReponse);

    expect(SurveyOwner.query().where).toHaveBeenCalledWith(
      "user_id",
      mockUserId
    );

    expect(Survey.query().whereIn).toHaveBeenCalledWith(
      "id",
      mockSurveyOwners.map((surveyOwner) => surveyOwner.surveyId)
    );

    expect(mockReponse.status).toHaveBeenCalledWith(STATUS.OK);
    expect(mockReponse.status(STATUS.OK).json).toHaveBeenCalledWith(
      mockSurveys
    );
  });
});
