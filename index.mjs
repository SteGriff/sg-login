import express from "express";
import expressNunjucks from "express-nunjucks";
import Database from "better-sqlite3";
import createSqliteStore from "better-sqlite3-session-store";
import session from "express-session";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateUser, createUser, auth } from "./logic/auth.mjs";
import { getSuccess, isSuccess } from "./results.mjs";
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

// Reusable bits

const trySetSessionUser = async (req) => {
  const result = await authenticateUser(
    db,
    req.body.username,
    req.body.password
  );
  req.session.user = result.model;
  return result;
};

const getModel = (req) => {
  return { user: req.session?.user };
};

// Routes

app.get("/", (req, res) => res.render("index", getModel(req)));

app.get("/login", (req, res) => {
  if (req.session.user) res.redirect("/");
  else res.render("login", getModel(req));
});
app.post("/login", async (req, res) => {
  const loginResult = await trySetSessionUser(req);
  if (isSuccess(loginResult)) res.redirect("/");
  else res.render("login", loginResult);
});

app.get("/register", (req, res) => {
  if (req.session.user) res.redirect("/");
  else res.render("register", getModel(req));
});
app.post("/register", async (req, res) => {
  const registrationResult = await createUser(db, req.body);
  if (isSuccess(registrationResult)) {
    await trySetSessionUser(req);
    res.redirect("/");
  } else res.render("register", registrationResult);
});

app.post("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/api", async (_, res) => {
  return res.json(getSuccess());
});

app.get("/api/user", auth, async (req, res) => {
  return res.json(getSuccess(req.session.user));
});

app.post("/api/register", async (req, res) => {
  const response = await createUser(db, req.body);
  return res.json(response);
});

app.post("/api/login", async (req, res) => {
  const response = await trySetSessionUser(req);
  return res.json(response);
});

app.post("/api/logout", async (req, res) => {
  req.session.destroy();
  const response = getSuccess();
  return res.json(response);
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 443, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
