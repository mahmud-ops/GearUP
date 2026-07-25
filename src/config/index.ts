import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  app_url: process.env.APP_URL,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  node_env: process.env.NODE_ENV,
};
