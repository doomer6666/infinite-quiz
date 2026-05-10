import convict from "convict";
import validators from "convict-format-with-validator";

convict.addFormats(validators);

export type MainShema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
};

export const configShema = convict<MainShema>({
  PORT: {
    doc: "Port for incomming connections",
    format: "port",
    env: "PORT",
    default: 4000,
  },
  DB_HOST: {
    doc: "IP address of the database server",
    format: "ipaddress",
    env: "DB_HOST",
    default: "127.0.0.1",
  },
  SALT: {
    doc: "Salt for password hash",
    format: String,
    env: "SALT",
    default: null,
  },
  DB_USER: {
    doc: "Username to connect to the database",
    format: String,
    env: "DB_USER",
    default: null,
  },
  DB_PASSWORD: {
    doc: "Password  to connect to the database",
    format: String,
    env: "DB_PASSWORD",
    default: null,
  },
  DB_NAME: {
    doc: "Database name (MongoDB)",
    format: String,
    env: "DB_NAME",
    default: "six-cities",
  },
  DB_PORT: {
    doc: "Port to connect to the database",
    format: "port",
    env: "DB_PORT",
    default: "27017",
  },
});
