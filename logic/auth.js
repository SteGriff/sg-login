import { promisify } from "util";
import * as crypto from "crypto";
const pbkdf = promisify(crypto.pbkdf2);
const comparePasswords = promisify(crypto.timingSafeEqual);

const ITERATIONS = 1000;
const BITLENGTH = 128;
const ALGO = "sha256";

const getUser = (db, username) => {
  const row = db
    .prepare("SELECT * FROM [User] WHERE username = ?")
    .get(username);
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

  const result = await comparePasswords(user.Password, hashedInput);

  console.log("DB PW", user.Password);
  console.log("In PW", hashedInput);
  console.log("Result", result);
  return result;
};

export const createUser = async (db, userModel) => {
  const user = getUser(db, userModel.username);

  // If user exists, quit
  if (user !== undefined) return false;

  // No such user, let's create
  const salt = crypto.randomBytes(128).toString("base64");
  const hashedPassword = await pbkdf(
    userModel.password,
    salt,
    ITERATIONS,
    BITLENGTH,
    ALGO
  );

  console.log("Create User", userModel);
  console.log("Salt ", salt);
  console.log("In PW", hashedPassword);

  const result = db
    .prepare(
      "insert into [User] (Username, Email, Password, Salt) values (?, ?, ?, ?)"
    )
    .run(userModel.username, userModel.email, hashedPassword, salt);

  console.log("Result", result);
  return result;
};
