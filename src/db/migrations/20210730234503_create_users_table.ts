import { Knex } from "knex";

import { PG_NOW, PG_UUID } from "../constants";

export async function up(knex: Knex): Promise<void> {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => {
    return knex.transaction((trx) => {
      return trx.schema.createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw(PG_UUID));
        table.string("email", 255).notNullable().unique();

        table.dateTime("created").defaultTo(knex.raw(PG_NOW));
        table.dateTime("modified").defaultTo(knex.raw(PG_NOW));
      });
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.transaction((trx) => {
    return trx.schema.dropTable("users");
  });
}
