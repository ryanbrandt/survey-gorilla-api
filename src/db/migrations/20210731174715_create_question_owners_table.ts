import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.createTable("question_owners", (table) => {
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

      table.primary(["question_id", "user_id"]);
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.dropTable("question_owners");
  });
}
