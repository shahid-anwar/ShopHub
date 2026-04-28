import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

console.log("CWD:", process.cwd());
console.log("ENV:", process.env.MONGODB_URI);
