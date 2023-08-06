import express from "express";
import expressNunjucks from "express-nunjucks";
import Database from "better-sqlite3";
import createSqliteStore from "better-sqlite3-session-store";
import session from "express-session";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateUser, createUser, auth } from "./logic/auth.js";
import { getSuccess, getError } from "./results.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up Express
const app = express();

// Parse application/x-www-form-urlencoded and application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Gets NODE_ENV, which defaults to development.
const isDev = app.get("env") === "development";

app.set("views", __dirname + "/views");
app.set("view engine", "njk");

const njk = expressNunjucks(app, {
  watch: isDev,
  noCache: isDev,
});

dotenv.config();

app.use(express.static("public"));
// app.use("/audio", express.static("audio"));

// DB and Auth
const db = new Database(".data/app.db");
db.pragma("journal_mode = WAL");

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    name: "sgnx",
    cookie: {
      httpOnly: true,
      secure: !isDev,
      sameSite: true,
      maxAge: 600_000, // ms
    },
  })
);

// Routes

app.get("/", (req, res) => res.render("index", { user: req.session.user }));
app.get("/login", (req, res) =>
  res.render("login", { user: req.session.user })
);
app.get("/register", (req, res) =>
  res.render("register", { user: req.session.user })
);

app.get("/api", async (_, res) => {
  return res.json(getSuccess());
});

app.get("/api/whoami", auth, async (req, res) => {
  return res.json(getSuccess(req.session.user));
});

app.post("/api/register", async (req, res) => {
  console.log("Register", req.body);
  const result = await createUser(db, req.body);
  console.log("Route result", result);
  const response = result ? getSuccess() : getError();

  return res.json(response);
});

app.post("/api/login", async (req, res) => {
  console.log("Login", req.body);
  const maskedUser = await authenticateUser(
    db,
    req.body.username,
    req.body.password
  );
  req.session.user = maskedUser;
  const response = maskedUser ? getSuccess(maskedUser) : getError();
  return res.json(response);
});

app.post("/api/logout", async (req, res) => {
  console.log("Logout", req.body);
  req.session.destroy();
  const response = getSuccess();
  return res.json(response);
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 443, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
