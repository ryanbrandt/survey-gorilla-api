import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMappings,
  RelationMapping,
} from "objection";
import Question from "./Question";

import Survey from "./Survey";
import User from "./User";

class Answer extends Model {
  id!: string;
  questionId!: string;
  userId!: string;
  values!: object;

  survey?: Survey;
  question?: Question;
  user?: User;

  static columnNameMappers = snakeCaseMappers();

  static get tableName(): string {
    return "answers";
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: "object",
      required: ["questionId", "userId", "values"],
      properties: {
        questionId: { type: "string" },
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
          from: "answers.id",
          through: {
            from: "survey_answers.answer_id",
            to: "survey_answers.survey_id",
          },
          to: "surveys.id",
        },
      } as RelationMapping<Survey>,
      question: {
        relation: Model.HasOneRelation,
        modelClass: Question,
        join: {
          from: "answers.question_id",
          to: "questions.id",
        },
      } as RelationMapping<Question>,
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: "answers.user_id",
          to: "users.id",
        },
      } as RelationMapping<User>,
    };
  }
}

export default Answer;
