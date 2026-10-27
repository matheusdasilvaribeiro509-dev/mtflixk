import path from "path";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { DbSchema } from "./types";

const file = path.join(__dirname, "..", "data", "db.json");
const adapter = new FileSync<DbSchema>(file);
export const db = low(adapter);

// Garante a estrutura inicial do banco, caso o arquivo esteja vazio.
db.defaults({ users: [], titles: [], favorites: [], history: [] }).write();
