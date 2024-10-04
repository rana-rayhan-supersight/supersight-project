import { join } from "path";
import { DataSource } from "typeorm";
import {
  supersight_db_host,
  supersight_db_password_v1,
  supersight_db_v1,
} from "../secrect";

const AppDataSource = new DataSource({
  type: "postgres",
  host: supersight_db_host,
  port: 5050,
  username: "postgres",
  password: supersight_db_password_v1,
  database: supersight_db_v1,
  synchronize: true,
  logging: ["error", "migration", "schema", "warn"],
  entities: [join(__dirname, "..", "entities", "**", "*.{ts,js}")],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
