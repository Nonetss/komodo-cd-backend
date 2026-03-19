// src/db/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth, keycloak } from "better-auth/plugins/generic-oauth";
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
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["keycloak"],
    },
  },
  user: {
    additionalFields: {
      groups: {
        type: "string",
        required: true,
        input: false,
        transform: {
          input: (val: string | string[]) =>
            Array.isArray(val) ? JSON.stringify(val) : val,
          output: (val: string) => {
            try {
              return JSON.parse(val);
            } catch {
              return [];
            }
          },
        },
      },
    },
  },

  plugins: [
    apiKey(),
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: process.env.SSO_CLIENT_ID || "",
          clientSecret: process.env.SSO_CLIENT_SECRET || "",
          discoveryUrl: process.env.SSO_ISSUER || "",
          scopes: ["openid", "profile", "email"],
          pkce: true,
          overrideUserInfo: true,
          mapProfileToUser: async (profile) => {
            return {
              id: profile.sub,
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              groups: profile.groups,
            };
          },
        },
      ],
    }),
  ],
});
