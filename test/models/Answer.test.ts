import { Model, ValidationError } from "objection";

import Answer from "../../src/models/Answer";
import Question from "../../src/models/Question";
import Survey from "../../src/models/Survey";
import User from "../../src/models/User";

describe("Answer model", () => {
  describe("tableName", () => {
    it("returns the correct table name", () => {
      expect(Answer.tableName).toBe("answers");
    });
  });

  describe("validation", () => {
    it("validates the model when given all valid attributes", () => {
      expect(() =>
        Answer.fromJson({ questionId: "id", userId: "id", values: {} })
      ).not.toThrow();
    });

    it("throws when missing question ID", () => {
      expect(() => Answer.fromJson({ userId: "id", values: {} })).toThrow(
        ValidationError
      );
    });

    it("throws when missing userId", () => {
      expect(() => Answer.fromJson({ questionId: "id", values: {} })).toThrow(
        ValidationError
      );
    });

    it("throws when missing values", () => {
      expect(() => Answer.fromJson({ userId: "id", questionId: "id" })).toThrow(
        ValidationError
      );
    });
  });

  describe("relationships", () => {
    it("includes an association to a survey", () => {
      expect(Answer.relationMappings.survey.relation).toBe(
        Model.HasOneRelation
      );
      expect(Answer.relationMappings.survey.modelClass).toBe(Survey);
    });

    it("includes an association to a question", () => {
      expect(Answer.relationMappings.question.relation).toBe(
        Model.HasOneRelation
      );
      expect(Answer.relationMappings.question.modelClass).toBe(Question);
    });

    it("includes an association to a user", () => {
      expect(Answer.relationMappings.user.relation).toBe(Model.HasOneRelation);
      expect(Answer.relationMappings.user.modelClass).toBe(User);
    });
  });
});
