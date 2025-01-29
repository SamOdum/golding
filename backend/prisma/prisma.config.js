import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
