import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMappings,
  RelationMapping,
} from "objection";

import Survey from "./Survey";

class Question extends Model {
  id!: string;
  surveyId!: string;
  title!: string;
  componentSchemaId!: string;
  componentConfiguration!: string;

  static columnNameMappers = snakeCaseMappers();

  static get tableName(): string {
    return "questions";
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: "object",
      required: [
        "id",
        "surveyId",
        "title",
        "componentSchemaId",
        "componentConfiguration",
      ],
      properties: {
        id: { type: "string" },
        surveyId: { type: "string" },
        title: { type: "string", maxLength: 255 },
        componentSchemaId: { type: "string", maxLength: 50 },
        componentConfiguration: { type: "object" },
      },
    };
  }

  static get relationMappings(): RelationMappings {
    return {
      survey: {
        relation: Model.HasOneRelation,
        modelClass: Survey,
        join: {
          from: "surveyId",
          to: "surveys.id",
        },
      } as RelationMapping<Survey>,
    };
  }
}

export default Question;
