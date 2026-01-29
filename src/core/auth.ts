// src/db/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/core/config";
import {
  user,
  session,
  account,
  verification,
  ssoProvider,
} from "@/db/models/auth-schema";
import { sso } from "@better-auth/sso";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
      ssoProvider: ssoProvider,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL || "",
  secret: process.env.BETTER_AUTH_SECRET || "",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "",
    process.env.SSO_BASE_URL || "",
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [sso()],
});
