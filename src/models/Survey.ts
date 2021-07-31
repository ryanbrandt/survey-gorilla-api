import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMappings,
  RelationMapping,
} from "objection";
import Answer from "./Answer";
import User from "./User";

class Survey extends Model {
  id!: string;
  title!: string;
  created!: Date;
  modified!: Date;

  owner?: User;
  answers?: Answer[];

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
      required: ["id", "title"],
      properties: {
        id: { type: "string" },
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
      answers: {
        relation: Model.HasManyRelation,
        modelClass: Answer,
        join: {
          from: "surveys.id",
          to: "answers.survey_id",
        },
      } as RelationMapping<Answer>,
    };
  }
}

export default Survey;
