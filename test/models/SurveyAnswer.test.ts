import { Model, ValidationError } from "objection";

import Answer from "../../src/models/Answer";
import Survey from "../../src/models/Survey";
import SurveyAnswer from "../../src/models/SurveyAnswer";

describe("SurveyAnswer model", () => {
  describe("tableName", () => {
    it("returns the correct table", () => {
      expect(SurveyAnswer.tableName).toBe("survey_answers");
    });
  });

  describe("idColumn", () => {
    it("returns the composite key", () => {
      expect(SurveyAnswer.idColumn).toEqual(["survey_id", "answer_id"]);
    });
  });

  describe("validation", () => {
    it("validates the model if all required attributes are included", () => {
      expect(() =>
        SurveyAnswer.fromJson({ surveyId: "id", answerId: "id" })
      ).not.toThrow();
    });

    it("throws is survey id is missing", () => {
      expect(() => SurveyAnswer.fromJson({ answerId: "id" })).toThrow(
        ValidationError
      );
    });

    it("throws is answer id is missing", () => {
      expect(() => SurveyAnswer.fromJson({ surveyId: "id" })).toThrow(
        ValidationError
      );
    });
  });

  describe("relationships", () => {
    it("has an assocation to an answer", () => {
      expect(SurveyAnswer.relationMappings.answer.relation).toBe(
        Model.HasOneRelation
      );
      expect(SurveyAnswer.relationMappings.answer.modelClass).toBe(Answer);
    });

    it("has an association to a survey", () => {
      expect(SurveyAnswer.relationMappings.survey.relation).toBe(
        Model.HasOneRelation
      );
      expect(SurveyAnswer.relationMappings.survey.modelClass).toBe(Survey);
    });
  });
});
