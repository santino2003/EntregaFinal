import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {PORT, MONGO_URL ,SECRET_JWT} =
  process.env;
