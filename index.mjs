import Database from "better-sqlite3";
import createSqliteStore from "better-sqlite3-session-store";
import session from "express-session";

const db = new Database(".data/app.db", options);
db.pragma("journal_mode = WAL");

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
