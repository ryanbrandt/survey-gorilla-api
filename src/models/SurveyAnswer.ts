import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMapping,
  RelationMappings,
} from "objection";

import Answer from "./Answer";
import Survey from "./Survey";

class SurveyAnswer extends Model {
  surveyId!: string;
  answerId!: string;

  static columnNameMappers = snakeCaseMappers();

  static get tableName(): string {
    return "survey_answers";
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: "object",
      required: ["surveyId", "answerId"],
      properties: {
        surveyId: { type: "string" },
        answerId: { type: "string" },
      },
    };
  }

  static get idColumn(): Array<string> {
    return ["survey_id", "answer_id"];
  }

  static get relationMappings(): RelationMappings {
    return {
      answer: {
        relation: Model.HasOneRelation,
        modelClass: Answer,
        join: {
          from: `${SurveyAnswer.tableName}.user_id`,
          to: `${Answer.tableName}.id`,
        },
      } as RelationMapping<Answer>,
      survey: {
        relation: Model.HasOneRelation,
        modelClass: Survey,
        join: {
          from: `${SurveyAnswer.tableName}.survey_id`,
          to: `${Survey.tableName}.id`,
        },
      } as RelationMapping<Survey>,
    };
  }
}

export default SurveyAnswer;
