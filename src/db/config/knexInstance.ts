import Knex from "knex";

import knexFile from "./knexfile";

const knex = Knex(knexFile);

export default knex;
