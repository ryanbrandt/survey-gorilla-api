import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMapping,
  RelationMappings,
} from "objection";

import Survey from "./Survey";
import User from "./User";

class SurveyOwner extends Model {
  surveyId!: string;
  userId!: string;

  static columnNameMappers = snakeCaseMappers();

  static get tableName(): string {
    return "survey_owners";
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: "object",
      required: ["surveyId", "userId"],
      properties: {
        surveyId: { type: "string" },
        userId: { type: "string" },
      },
    };
  }

  static get idColumn(): Array<string> {
    return ["survey_id", "user_id"];
  }

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: `${SurveyOwner.tableName}.user_id`,
          to: `${User.tableName}.id`,
        },
      } as RelationMapping<User>,
      survey: {
        relation: Model.HasOneRelation,
        modelClass: Survey,
        join: {
          from: `${SurveyOwner.tableName}.survey_id`,
          to: `${Survey.tableName}.id`,
        },
      } as RelationMapping<Survey>,
    };
  }
}

export default SurveyOwner;
