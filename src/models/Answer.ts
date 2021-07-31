import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMappings,
  RelationMapping,
} from "objection";

import Survey from "./Survey";
import User from "./User";

class Answer extends Model {
  surveyId!: string;
  userId!: string;
  values!: object;

  static columnNameMappers = snakeCaseMappers();

  static get tableName(): string {
    return "answers";
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: "object",
      required: ["surveyId", "userId", "values"],
      properties: {
        surveyId: { type: "string" },
        userId: { type: "string" },
        values: { type: "object" },
      },
    };
  }

  static get relationMappings(): RelationMappings {
    return {
      survey: {
        relation: Model.HasOneRelation,
        modelClass: Survey,
        join: {
          from: "surveyId",
          to: "surveys.id",
        },
      } as RelationMapping<Survey>,
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: "userId",
          to: "users.id",
        },
      } as RelationMapping<User>,
    };
  }
}

export default Answer;
