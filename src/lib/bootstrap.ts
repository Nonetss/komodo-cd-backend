// Script de inicialización del backend
import { db } from "@/core/config";
import { user, ssoProvider } from "@/db/models/auth-schema";
import { auth } from "@/core/auth";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Crea el usuario admin si no existe
 */
async function ensureAdminUser() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;

  if (!adminEmail) {
    console.log(
      "⚠️  SEED_ADMIN_EMAIL no definido, omitiendo creación de admin",
    );
    return;
  }

  try {
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, adminEmail))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log("✅ Usuario admin ya existe");
      return;
    }

    const { user: newUser } = await auth.api.signUpEmail({
      body: {
        email: process.env.SEED_ADMIN_EMAIL!,
        name: process.env.SEED_ADMIN_NAME!,
        password: process.env.SEED_ADMIN_PASSWORD!,
      },
    });

    console.log("✅ Usuario admin creado:", newUser?.email);
  } catch (error) {
    console.error("❌ Error creando usuario admin:", error);
  }
}

/**
 * Crea o actualiza el proveedor SSO si ENABLE_SSO=true
 */
async function ensureSSOProvider() {
  const enableSSO = process.env.ENABLE_SSO?.toLowerCase() === "true";

  if (!enableSSO) {
    console.log("ℹ️  SSO deshabilitado (ENABLE_SSO != true)");
    return;
  }

  const SLUG_APP = process.env.SSO_SLUG_APP;
  const BASE_SSO = process.env.SSO_BASE_URL;

  if (!SLUG_APP || !BASE_SSO) {
    console.log(
      "⚠️  Variables SSO no configuradas, omitiendo configuración SSO",
    );
    return;
  }

  const oidcConfigObj = {
    clientId: process.env.SSO_CLIENT_ID!,
    clientSecret: process.env.SSO_CLIENT_SECRET!,
    authorizationEndpoint: `${BASE_SSO}/application/o/authorize/`,
    tokenEndpoint: `${BASE_SSO}/application/o/token/`,
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
          oidcConfig: authentikConfig.oidcConfig,
          samlConfig: null,
          userId: null,
          organizationId: null,
        })
        .where(eq(ssoProvider.providerId, "authentik"));
      console.log("✅ Proveedor SSO 'authentik' actualizado");
    } else {
      await db.insert(ssoProvider).values(authentikConfig);
      console.log("✅ Proveedor SSO 'authentik' registrado");
    }
  } catch (error) {
    console.error("❌ Error configurando SSO:", error);
  }
}

/**
 * Función principal de bootstrap que se ejecuta al iniciar el backend
 */
export async function bootstrap() {
  console.log("🚀 Iniciando bootstrap...");

  await ensureAdminUser();
  await ensureSSOProvider();

  console.log("✅ Bootstrap completado");
}
