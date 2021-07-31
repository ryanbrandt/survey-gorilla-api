import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMappings,
  RelationMapping,
} from "objection";

import Question from "./Question";
import User from "./User";

class Survey extends Model {
  id!: string;
  title!: string;
  created!: Date;
  modified!: Date;

  owner?: User;
  questions?: Question[];

  static columnNameMappers = snakeCaseMappers();

  static async findById(surveyId: string): Promise<Survey> {
    return await Survey.query().where("id", surveyId).first();
  }

  static get tableName(): string {
    return "surveys";
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string", maxLength: 255 },
      },
    };
  }

  static get relationMappings(): RelationMappings {
    return {
      owner: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: "surveys.id",
          through: {
            from: "survey_owners.survey_id",
            to: "survey_owners.user_id",
          },
          to: "users.id",
        },
      } as RelationMapping<User>,
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: "surveys.id",
          through: {
            from: "survey_questions.survey_id",
            to: "survey_questions.question_id",
          },
          to: "questions.id",
        },
      } as RelationMapping<Question>,
    };
  }
}

export default Survey;
