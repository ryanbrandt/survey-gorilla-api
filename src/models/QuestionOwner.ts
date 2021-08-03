import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMapping,
  RelationMappings,
} from "objection";

import Question from "./Question";
import User from "./User";

class QuestionOwner extends Model {
  userId!: string;
  questionId!: string;

  static columnNameMappers = snakeCaseMappers();

  static get tableName(): string {
    return "question_owners";
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: "object",
      required: ["userId", "questionId"],
      properties: {
        surveyId: { type: "string" },
        questionId: { type: "string" },
      },
    };
  }

  static get idColumn(): Array<string> {
    return ["user_id", "question_id"];
  }

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: `${QuestionOwner.tableName}.user_id`,
          to: `${User.tableName}.id`,
        },
      } as RelationMapping<User>,
      question: {
        relation: Model.HasOneRelation,
        modelClass: Question,
        join: {
          from: `${Question.tableName}.question_id`,
          to: `${Question.tableName}.id`,
        },
      } as RelationMapping<Question>,
    };
  }
}

export default QuestionOwner;
