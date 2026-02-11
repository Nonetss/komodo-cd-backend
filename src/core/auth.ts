// src/db/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth, keycloak } from "better-auth/plugins/generic-oauth";
import { db } from "@/core/config";
import {
  user as userTable,
  session,
  account,
  verification,
  ssoProvider,
} from "@/db/models/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: userTable,
      session: session,
      account: account,
      verification: verification,
      ssoProvider: ssoProvider,
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
        type: "string[]",
        required: true,
      },
    },
  },

  plugins: [
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
