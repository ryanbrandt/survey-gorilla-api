import path from "path";

const config = Object.freeze({
  client: "postgresql",
  pool: {
    min: 2,
    max: 10,
  },
  connection: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_DB_HOST,
    port: Number.parseInt(process.env.POSTGRES_PORT || "5432"),
    database: process.env.POSTGRES_DB_NAME,
  },
  migrations: {
    tableName: "migrations",
    directory: path.resolve("..", "migrations"),
    extension: "ts",
  },
});

export default config;
