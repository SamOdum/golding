import path from "path";
const { getEnvVar } = require("../src/utils/env");

/** @type {import('@prisma/client').Prisma.PrismaClientOptions} */
const config = {
  datasources: {
    db: {
      url: getEnvVar(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/golding"
      ),
    },
  },
};

module.exports = config;
