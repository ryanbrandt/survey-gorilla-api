import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMappings,
  RelationMapping,
} from "objection";
import Question from "./Question";

import Survey from "./Survey";
import SurveyAnswer from "./SurveyAnswer";
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
          from: `${Answer.tableName}.id`,
          through: {
            from: `${SurveyAnswer.tableName}.answer_id`,
            to: `${SurveyAnswer.tableName}.survey_id`,
          },
          to: `${Survey.tableName}.id`,
        },
      } as RelationMapping<Survey>,
      question: {
        relation: Model.HasOneRelation,
        modelClass: Question,
        join: {
          from: `${Answer.tableName}.question_id`,
          to: `${Question.tableName}.id`,
        },
      } as RelationMapping<Question>,
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: `${Answer.tableName}.user_id`,
          to: `${User.tableName}.id`,
        },
      } as RelationMapping<User>,
    };
  }
}

export default Answer;
