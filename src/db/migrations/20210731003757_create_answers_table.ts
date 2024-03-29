import { Knex } from "knex";

import { PG_UUID } from "../constants";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.createTable("answers", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw(PG_UUID));
      table
        .uuid("question_id")
        .references("id")
        .inTable("questions")
        .onDelete("cascade");

      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("cascade");

      table.jsonb("values").notNullable();
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.dropTable("answers");
  });
}
