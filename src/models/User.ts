import {
  Model,
  JSONSchema,
  snakeCaseMappers,
  RelationMapping,
  RelationMappings,
} from "objection";

import Answer from "./Answer";
import Survey from "./Survey";

class User extends Model {
  id!: string;
  email!: string;
  created!: Date;
  modified!: Date;

  ownedSurveys?: Survey[];
  answers?: Answer[];

  static columnNameMappers = snakeCaseMappers();

  static async findById(userId: string): Promise<User> {
    return await User.query().where("id", userId).first();
  }

  static get tableName(): string {
    return "users";
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: "object",
      required: ["id", "email"],
      properties: {
        id: { type: "string" },
        email: { type: "string", maxLength: 255 },
      },
    };
  }

  static get relationMappings(): RelationMappings {
    return {
      ownedSurveys: {
        relation: Model.HasManyRelation,
        modelClass: Survey,
        join: {
          from: "users.id",
          through: {
            from: "survey_owners.user_id",
            to: "survey_owners.survey_id",
          },
          to: "surveys.id",
        },
      } as RelationMapping<Survey>,
      answers: {
        relation: Model.HasManyRelation,
        modelClass: Answer,
        join: {
          from: "users.id",
          to: "answers.user_id",
        },
      } as RelationMapping<Answer>,
    };
  }
}

export default User;
