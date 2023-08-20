import { promisify } from "util";
import * as crypto from "crypto";
import zxcvbn from "zxcvbn";
import { getError, getSuccess } from "../results.mjs";
import { get } from "http";
const pbkdf = promisify(crypto.pbkdf2);
const comparePasswords = crypto.timingSafeEqual;

const ITERATIONS = 1000;
const BITLENGTH = 128;
const ALGO = "sha256";

const getUser = (db, username) => {
  return db.prepare("SELECT * FROM [User] WHERE username = ?").get(username);
};

const maskUser = (user) => {
  return {
    ID: user.ID,
    Username: user.Username,
    Email: user.Email,
  };
};

// Middleware
export const auth = (req, res, next) => {
  if (req.session.user && req.session.user.ID) next();
  else res.status(401).send(getError());
};

// Exports
export const getUserData = (db, username) => {
  const user = getUser(db, username);
  return maskUser(user);
};

export const userExists = (db, username) => {
  return getUser(db, username) !== undefined;
};

export const authenticateUser = async (db, username, password) => {
  const user = getUser(db, username);

  // If user doesn't exit, quit
  if (user === undefined) return false;

  // Check passwords match
  const hashedInput = await pbkdf(
    password,
    user.Salt,
    ITERATIONS,
    BITLENGTH,
    ALGO
  );
  const isMatch = comparePasswords(user.Password, hashedInput);
  const result = isMatch ? maskUser(user) : null;

  return result;
};

export const createUser = async (db, userModel) => {
  // Preconditions
  if (!userModel.username || !userModel.password)
    return getError("Missing username or password param");

  // If user exists, quit
  const user = getUser(db, userModel.username);
  if (user !== undefined) return getError("User exists already.");

  // Test password strength
  const pwResult = zxcvbn(userModel.password);
  if (pwResult.score < 3)
    return getError("Password too weak: " + pwResult.feedback.suggestions);

  // No such user, let's create
  const salt = crypto.randomBytes(128).toString("base64");
  const hashedPassword = await pbkdf(
    userModel.password,
    salt,
    ITERATIONS,
    BITLENGTH,
    ALGO
  );

  const dbResult = db
    .prepare(
      "insert into [User] (Username, Email, Password, Salt) values (?, ?, ?, ?)"
    )
    .run(userModel.username, userModel.email, hashedPassword, salt);

  return getSuccess(dbResult);
};
