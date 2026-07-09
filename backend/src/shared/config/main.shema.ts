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
  JWT_SECRET: string;
  UPLOAD_DIR: string;
  STATIC_URL: string;
  HOST: string;
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
  JWT_SECRET: {
    doc: "Secret for sign JWT",
    format: String,
    env: "JWT_SECRET",
    default: null,
  },
  UPLOAD_DIR: {
    doc: "Directory for uploaded images",
    format: String,
    env: "UPLOAD_DIR",
    default: null,
  },
  STATIC_URL: {
    doc: "URL path images",
    format: String,
    env: "STATIC_URL",
    default: null,
  },
  HOST: {
    doc: "Host where started service",
    format: String,
    env: "HOST",
    default: "localhost",
  },
});
