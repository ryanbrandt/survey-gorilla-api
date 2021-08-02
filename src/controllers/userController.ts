import { Request, Response } from "express";

import Survey from "../models/Survey";
import { STATUS } from "../utils/types";
import SurveyOwner from "../models/SurveyOwner";

import User from "../models/User";

class userController {
  async getUserOwnedSurveys(
    request: Request,
    response: Response
  ): Promise<void> {
    const { id } = request.params;

    const userOwnedSurveys = await User.transaction(async () => {
      const surveyOwners = await SurveyOwner.query().where("user_id", id);

      return await Survey.query().whereIn(
        "id",
        surveyOwners.map((surveyOwner) => surveyOwner.surveyId)
      );
    });

    response.status(STATUS.OK).json(userOwnedSurveys);
  }
}

export default userController;
