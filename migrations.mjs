import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Hello migrations @", __dirname);

console.log("Connect DB");
const db = new Database(".data/app.db");
db.pragma("journal_mode = WAL");

const scriptRoot = "sql/";
const scripts = ["create-table-user.sql", "create-table-logging.sql"];

scripts.forEach(async (sf) => {
  const filepath = path.resolve(__dirname, scriptRoot, sf);
  console.log("Run", sf, filepath);

  const sqlContent = await fs.promises.readFile(filepath, "utf8");
  db.exec(sqlContent);
});
