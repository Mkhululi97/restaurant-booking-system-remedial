/* ##### BRING IN PG PROMISE ##### */
import pgPromise from "pg-promise";
/* ##### BRING IN THE DOTENV ##### */
import dotenv from "dotenv";
/* CONFIGURE THE ENVIROMENT VARIABLE FILE */
dotenv.config();
/* GRAB THE VARIABLES FROM THE .ENV FILE*/
const connectDb = {
  databaseurl: process.env.PGDATABASE_URL,
};
/* CREATE YOUR DATABASE */
const db = pgPromise()(connectDb);
/* CONNECT TO YOUR DATABASE */
db.connect();
export default db;
