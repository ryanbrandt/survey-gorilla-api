import { Knex } from "knex";

import { PG_NOW, PG_UUID } from "../constants";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.createTable("surveys", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw(PG_UUID));
      table.string("title", 255).notNullable();

      table.dateTime("created").defaultTo(knex.raw(PG_NOW));
      table.dateTime("modified").defaultTo(knex.raw(PG_NOW));
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.dropTable("surveys");
  });
}
