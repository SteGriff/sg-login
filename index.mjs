import express from "express";
import Database from "better-sqlite3";
import createSqliteStore from "better-sqlite3-session-store";
import session from "express-session";
import * as dotenv from "dotenv";
import { getError } from "./results.mjs";

const app = express();
dotenv.config();

// app.use(express.static("public"));
// app.use("/audio", express.static("audio"));

const db = new Database(".data/app.db");
db.pragma("journal_mode = WAL");

app.get("/", async (_, res) => {
  try {
    const result = {
      Route: "/",
    };
    return res.json(result);
  } catch (error) {
    console.error(error);
    return getError(error);
  }
});

// const row = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
// console.log(row.firstName, row.lastName, row.email);

const SqliteStore = createSqliteStore(session);

// https://jscrambler.com/blog/best-practices-for-secure-session-management-in-node
app.use(
  session({
    store: new SqliteStore({
      client: db,
      expired: {
        clear: true,
        intervalMs: 900000, //ms = 15min
      },
    }),
    secret: "keyboard cat",
    resave: false,
  })
);

// listen for requests :)
const listener = app.listen(process.env.PORT || 443, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
