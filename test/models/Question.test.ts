import { Model, ValidationError } from "objection";

import Answer from "../../src/models/Answer";
import Question from "../../src/models/Question";
import Survey from "../../src/models/Survey";
import User from "../../src/models/User";

describe("Question model", () => {
  describe("tableName", () => {
    it("returns the correct table", () => {
      expect(Question.tableName).toBe("questions");
    });
  });

  describe("validation", () => {
    it("validates the model when all required attributes are included", () => {
      expect(() =>
        Question.fromJson({
          title: "title",
          componentSchemaId: "id",
          componentConfiguration: [{}],
        })
      ).not.toThrow();
    });

    it("throws when title is not included", () => {
      expect(() =>
        Question.fromJson({
          componentSchemaId: "id",
          componentConfiguration: [{}],
        })
      ).toThrow(ValidationError);
    });

    it("thrrows when componentSchemaId is not included", () => {
      expect(() =>
        Question.fromJson({
          title: "title",
          componentConfiguration: [{}],
        })
      ).toThrow(ValidationError);
    });

    it("throws when component configuration is not included", () => {
      expect(() =>
        Question.fromJson({
          title: "title",
          componentSchemaId: "id",
        })
      ).toThrow(ValidationError);
    });
  });

  describe("relationships", () => {
    it("includes many associations to surveys", () => {
      expect(Question.relationMappings.surveys.relation).toBe(
        Model.HasManyRelation
      );
      expect(Question.relationMappings.surveys.modelClass).toBe(Survey);
    });

    it("includes an assocation to a user", () => {
      expect(Question.relationMappings.owner.relation).toBe(
        Model.HasOneRelation
      );
      expect(Question.relationMappings.owner.modelClass).toBe(User);
    });

    it("includes many assocations to answers", () => {
      expect(Question.relationMappings.answers.relation).toBe(
        Model.HasManyRelation
      );
      expect(Question.relationMappings.answers.modelClass).toBe(Answer);
    });
  });
});
