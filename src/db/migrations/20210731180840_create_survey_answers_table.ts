import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.createTable("survey_answers", (table) => {
      table
        .uuid("survey_id")
        .references("id")
        .inTable("surveys")
        .onDelete("cascade");

      table
        .uuid("answer_id")
        .references("id")
        .inTable("answers")
        .onDelete("cascade");

      table.primary(["survey_id", "answer_id"]);
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.dropTable("survey_answers");
  });
}
