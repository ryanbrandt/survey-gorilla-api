import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMappings,
  RelationMapping,
} from "objection";

import Question from "./Question";
import SurveyOwner from "./SurveyOwner";
import SurveyQuestion from "./SurveyQuestion";
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
          from: `${Survey.tableName}.id`,
          through: {
            from: `${SurveyOwner.tableName}.survey_id`,
            to: `${SurveyOwner.tableName}.user_id`,
          },
          to: `${User.tableName}.id`,
        },
      } as RelationMapping<User>,
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: `${Survey.tableName}.id`,
          through: {
            from: `${SurveyQuestion.tableName}.survey_id`,
            to: `${SurveyQuestion.tableName}.question_id`,
          },
          to: `${Question.tableName}.id`,
        },
      } as RelationMapping<Question>,
    };
  }
}

export default Survey;
