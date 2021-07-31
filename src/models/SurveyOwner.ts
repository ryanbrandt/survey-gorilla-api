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

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: "users.id",
          to: "survey_owners.user_id",
        },
      } as RelationMapping<User>,
      survey: {
        relation: Model.HasOneRelation,
        modelClass: Survey,
        join: {
          from: "surveys.id",
          to: "survey_owners.survey_id",
        },
      } as RelationMapping<Survey>,
    };
  }
}

export default SurveyOwner;
