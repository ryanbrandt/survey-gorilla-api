import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.createTable("survey_questions", (table) => {
      table
        .uuid("survey_id")
        .references("id")
        .inTable("surveys")
        .onDelete("cascade");

      table
        .uuid("question_id")
        .references("id")
        .inTable("questions")
        .onDelete("cascade");

      table.primary(["survey_id", "question_id"]);
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.dropTable("survey_questions");
  });
}
