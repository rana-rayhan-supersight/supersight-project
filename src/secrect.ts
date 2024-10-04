import { config } from "dotenv";
config();

// server port
const serverPort = process.env.SERVER_PORT;

// Database props
const supersight_db_host = process.env.SUPERSIGHT_DB_HOST || "localhost";
const supersight_db_v1 = process.env.SUPERSIGHT_DB_V1;
const supersight_db_password_v1 = process.env.SUPERSIGHT_DB_PASSWORD_V1;

export {
  serverPort,
  supersight_db_host,
  supersight_db_v1,
  supersight_db_password_v1,
};
