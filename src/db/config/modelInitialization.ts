import { Model } from "objection";

import knex from "./knexInstance";

Model.knex(knex);
