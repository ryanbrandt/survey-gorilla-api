import { Model, ValidationError } from "objection";

import Question from "../../src/models/Question";
import Survey from "../../src/models/Survey";
import User from "../../src/models/User";

jest.mock("knex");

describe("Survey model", () => {
  describe("tableName", () => {
    it("returns the correct table", () => {
      expect(Survey.tableName).toBe("surveys");
    });
  });

  describe("validation", () => {
    it("validates the model when all required attributes are included", () => {
      expect(() => Survey.fromJson({ title: "title" })).not.toThrow();
    });

    it("throws when title is not included", () => {
      expect(() => Survey.fromJson({})).toThrow(ValidationError);
    });
  });

  describe("relationships", () => {
    it("has an association to a user", () => {
      expect(Survey.relationMappings.owner.relation).toBe(Model.HasOneRelation);
      expect(Survey.relationMappings.owner.modelClass).toBe(User);
    });

    it("has many assocations to questions", () => {
      expect(Survey.relationMappings.questions.relation).toBe(
        Model.HasManyRelation
      );
      expect(Survey.relationMappings.questions.modelClass).toBe(Question);
    });
  });
});
