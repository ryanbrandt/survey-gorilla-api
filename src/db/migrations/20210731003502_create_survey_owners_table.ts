import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.createTable("survey_owners", (table) => {
      table
        .uuid("survey_id")
        .references("id")
        .inTable("surveys")
        .onDelete("cascade");
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("cascade");

      table.primary(["survey_id", "user_id"]);
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    trx.schema.dropTable("survey_owners");
  });
}
