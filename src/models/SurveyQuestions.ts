import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMapping,
  RelationMappings,
} from "objection";

import Survey from "./Survey";
import Question from "./Question";

class SurveyQuestion extends Model {
  surveyId!: string;
  questionId!: string;

  static columnNameMappers = snakeCaseMappers();

  static get tableName(): string {
    return "survey_questions";
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: "object",
      required: ["surveyId", "questionId"],
      properties: {
        surveyId: { type: "string" },
        questionId: { type: "string" },
      },
    };
  }

  static get idColumn(): Array<string> {
    return ["survey_id", "question_id"];
  }

  static get relationMappings(): RelationMappings {
    return {
      survey: {
        relation: Model.HasOneRelation,
        modelClass: Survey,
        join: {
          from: "survey_questions.survey_id",
          to: "surveys.id",
        },
      } as RelationMapping<Survey>,
      question: {
        relation: Model.HasOneRelation,
        modelClass: Question,
        join: {
          from: "survey_questions.question_id",
          to: "questions.id",
        },
      } as RelationMapping<Question>,
    };
  }
}

export default SurveyQuestion;
