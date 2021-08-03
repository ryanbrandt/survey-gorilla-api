import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMappings,
  RelationMapping,
} from "objection";

import Answer from "./Answer";
import QuestionOwner from "./QuestionOwner";
import Survey from "./Survey";
import SurveyQuestion from "./SurveyQuestion";
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
          from: `${Question.tableName}.id`,
          through: {
            from: `${SurveyQuestion.tableName}.question_id`,
            to: `${SurveyQuestion.tableName}.survey_id`,
          },
          to: `${Survey.tableName}.id`,
        },
      } as RelationMapping<Survey>,
      owner: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: `${Question.tableName}.id`,
          through: {
            from: `${QuestionOwner.tableName}.question_id`,
            to: `${QuestionOwner.tableName}.user_id`,
          },
          to: `${User.tableName}.id`,
        },
      } as RelationMapping<User>,
      answers: {
        relation: Model.HasManyRelation,
        modelClass: Answer,
        join: {
          from: `${Question.tableName}.id`,
          to: `${Answer.tableName}.question_id`,
        },
      } as RelationMapping<Question>,
    };
  }
}

export default Question;
