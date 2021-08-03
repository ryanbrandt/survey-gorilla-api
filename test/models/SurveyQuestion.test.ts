import { Model, ValidationError } from "objection";
import Question from "../../src/models/Question";
import Survey from "../../src/models/Survey";
import SurveyQuestion from "../../src/models/SurveyQuestion";

describe("SurveyQuestion model", () => {
  describe("tableName", () => {
    it("returns the correct table", () => {
      expect(SurveyQuestion.tableName).toBe("survey_questions");
    });
  });

  describe("idColumn", () => {
    it("returns the composite key", () => {
      expect(SurveyQuestion.idColumn).toEqual(["survey_id", "question_id"]);
    });
  });

  describe("validation", () => {
    it("validates the model when all required attributes are included", () => {
      expect(() =>
        SurveyQuestion.fromJson({ surveyId: "id", questionId: "id" })
      ).not.toThrow();
    });

    it("throws when survey id is not included", () => {
      expect(() => SurveyQuestion.fromJson({ questionId: "id" })).toThrow(
        ValidationError
      );
    });

    it("throws when question id is not included", () => {
      expect(() => SurveyQuestion.fromJson({ surveyId: "id" })).toThrow(
        ValidationError
      );
    });
  });

  describe("relationships", () => {
    it("has an association to a survey", () => {
      expect(SurveyQuestion.relationMappings.survey.relation).toBe(
        Model.HasOneRelation
      );
      expect(SurveyQuestion.relationMappings.survey.modelClass).toBe(Survey);
    });

    it("has an assocation to a question", () => {
      expect(SurveyQuestion.relationMappings.question.relation).toBe(
        Model.HasOneRelation
      );
      expect(SurveyQuestion.relationMappings.question.modelClass).toBe(
        Question
      );
    });
  });
});
