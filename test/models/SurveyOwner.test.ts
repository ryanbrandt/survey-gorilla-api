import { Model, ValidationError } from "objection";

import Survey from "../../src/models/Survey";
import SurveyOwner from "../../src/models/SurveyOwner";
import User from "../../src/models/User";

describe("SurveyOwner model", () => {
  describe("tableName", () => {
    it("returns the correct table", () => {
      expect(SurveyOwner.tableName).toBe("survey_owners");
    });
  });

  describe("idColumn", () => {
    it("returns the composite key", () => {
      expect(SurveyOwner.idColumn).toEqual(["survey_id", "user_id"]);
    });
  });

  describe("validation", () => {
    it("validates the model when all required attributes are included", () => {
      expect(() =>
        SurveyOwner.fromJson({ surveyId: "id", userId: "id" })
      ).not.toThrow();
    });

    it("throws when survey id is missing", () => {
      expect(() => SurveyOwner.fromJson({ userId: "id" })).toThrow(
        ValidationError
      );
    });

    it("throws when user id is missing", () => {
      expect(() => SurveyOwner.fromJson({ surveyId: "id" })).toThrow(
        ValidationError
      );
    });
  });

  describe("relationships", () => {
    it("has an assocation to a user", () => {
      expect(SurveyOwner.relationMappings.user.relation).toBe(
        Model.HasOneRelation
      );
      expect(SurveyOwner.relationMappings.user.modelClass).toBe(User);
    });

    it("has an association to a survey", () => {
      expect(SurveyOwner.relationMappings.survey.relation).toBe(
        Model.HasOneRelation
      );
      expect(SurveyOwner.relationMappings.survey.modelClass).toBe(Survey);
    });
  });
});
