import { Model, ValidationError } from "objection";

import Question from "../../src/models/Question";
import QuestionOwner from "../../src/models/QuestionOwner";
import User from "../../src/models/User";

describe("QuestionOwner model", () => {
  describe("tableName", () => {
    it("returns the correct table", () => {
      expect(QuestionOwner.tableName).toBe("question_owners");
    });
  });

  describe("validation", () => {
    it("validates the model when all required attributes are included", () => {
      expect(() =>
        QuestionOwner.fromJson({ questionId: "id", userId: "id" })
      ).not.toThrow();
    });

    it("throws when user id is missing", () => {
      expect(() => QuestionOwner.fromJson({ questionId: "id" })).toThrow(
        ValidationError
      );
    });

    it("throws when question id is missing", () => {
      expect(() => QuestionOwner.fromJson({ userId: "id" })).toThrow(
        ValidationError
      );
    });
  });

  describe("relationships", () => {
    it("has an assocation to a user", () => {
      expect(QuestionOwner.relationMappings.user.relation).toBe(
        Model.HasOneRelation
      );
      expect(QuestionOwner.relationMappings.user.modelClass).toBe(User);
    });

    it("has an assocation to a question", () => {
      expect(QuestionOwner.relationMappings.question.relation).toBe(
        Model.HasOneRelation
      );
      expect(QuestionOwner.relationMappings.question.modelClass).toBe(Question);
    });
  });
});
