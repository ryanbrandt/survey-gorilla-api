import { Knex } from "knex";

import { PG_UUID } from "../constants";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.createTable("questions", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw(PG_UUID));
      table.string("title", 255).notNullable();

      table.string("component_schema_id", 50).notNullable();
      table.jsonb("component_configuration").nullable().defaultTo("{}");
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    trx.schema.dropTable("questions");
  });
}
