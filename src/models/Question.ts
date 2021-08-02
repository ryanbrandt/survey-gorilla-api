import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMappings,
  RelationMapping,
} from "objection";

import Answer from "./Answer";
import Survey from "./Survey";
import User from "./User";

class Question extends Model {
  id!: string;
  title!: string;
  componentSchemaId!: string;
  componentConfiguration!: string;

  owner?: User;
  surveys?: Survey[];
  answers?: Answer[];

  static columnNameMappers = snakeCaseMappers();

  static get tableName(): string {
    return "questions";
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: "object",
      required: ["title", "componentSchemaId", "componentConfiguration"],
      properties: {
        title: { type: "string", maxLength: 255 },
        componentSchemaId: { type: "string", maxLength: 50 },
        componentConfiguration: { type: "array" },
      },
    };
  }

  static get relationMappings(): RelationMappings {
    return {
      surveys: {
        relation: Model.HasManyRelation,
        modelClass: Survey,
        join: {
          from: "id",
          through: {
            from: "survey_questions.question_id",
            to: "survey_questions.survey_id",
          },
          to: "surveys.id",
        },
      } as RelationMapping<Survey>,
      owner: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: "questions.id",
          through: {
            from: "question_owners.question_id",
            to: "question_owners.user_id",
          },
          to: "users.id",
        },
      } as RelationMapping<User>,
      answers: {
        relation: Model.HasManyRelation,
        modelClass: Answer,
        join: {
          from: "questions.id",
          to: "answers.question_id",
        },
      } as RelationMapping<Question>,
    };
  }
}

export default Question;
