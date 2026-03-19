import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey } from "@better-auth/api-key";
import { db } from "@/core/config";
import {
  user as userTable,
  session,
  account,
  verification,
  apikey,
} from "@/db/models/auth-schema";

export const auth = betterAuth({
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:4321",
    "http://localhost:3000",
    "http://localhost:4321",
  ],
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: userTable,
      session: session,
      account: account,
      verification: verification,
      apikey: apikey,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [apiKey()],
});
