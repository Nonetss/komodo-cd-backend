// Script para registrar o actualizar el proveedor SSO de Authentik
import { db } from "@/core/config";
import { ssoProvider } from "@/db/models/auth-schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const SLUG_APP = process.env.SSO_SLUG_APP!;
const BASE_SSO = process.env.SSO_BASE_URL!;

const oidcConfigObj = {
  clientId: process.env.SSO_CLIENT_ID!,
  clientSecret: process.env.SSO_CLIENT_SECRET!,
  authorizationEndpoint: `${BASE_SSO}/application/o/authorize/`,
  tokenEndpoint: `${BASE_SSO}/application/o/token/`,
  // IMPORTANTE: Estos dos suelen requerir el slug de la aplicación
  jwksEndpoint: `${BASE_SSO}/application/o/${SLUG_APP}/jwks/`,
  discoveryEndpoint: `${BASE_SSO}/application/o/${SLUG_APP}/.well-known/openid-configuration`,
  scopes: ["openid", "profile", "email"],
  pkce: true,
  mapping: {
    id: "sub",
    email: "email",
    name: "name",
    emailVerified: "email_verified",
    image: "picture",
  },
};

const authentikConfig = {
  id: randomUUID(),
  providerId: "authentik",
  issuer: `${BASE_SSO}/application/o/${SLUG_APP}/`,
  domain: process.env.SSO_DOMAIN!,
  oidcConfig: JSON.stringify(oidcConfigObj),
  samlConfig: null,
  userId: null,
  organizationId: null,
};

async function seedSSO() {
  try {
    const existing = await db
      .select()
      .from(ssoProvider)
      .where(eq(ssoProvider.providerId, "authentik"))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(ssoProvider)
        .set({
          issuer: authentikConfig.issuer,
          domain: authentikConfig.domain,
          oidcConfig: authentikConfig.oidcConfig, // Ya es un string, no repetir JSON.stringify
          samlConfig: null,
          userId: null,
          organizationId: null,
        })
        .where(eq(ssoProvider.providerId, "authentik"));
      console.log("✅ Proveedor SSO 'authentik' ACTUALIZADO correctamente");
    } else {
      await db.insert(ssoProvider).values(authentikConfig);
      console.log("✅ Proveedor SSO 'authentik' REGISTRADO por primera vez");
    }
  } catch (error) {
    console.error("❌ Error operando en la DB:", error);
  }
  process.exit(0);
}

seedSSO();
