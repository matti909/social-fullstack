import "dotenv/config";
import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", ".env") });
export const DataSourceConfig: DataSourceOptions = {
  type: "mysql",
  host: process.env.MYSQLDB_HOST,
  port: Number(process.env.MYSQLDB_LOCAL_PORT),
  username: process.env.MYSQLDB_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQLDB_DATABASE,
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  ssl: true,
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
};

export const AppDS = new DataSource(DataSourceConfig);
