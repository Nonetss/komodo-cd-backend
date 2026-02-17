// Script de inicialización del backend
import { db } from "@/core/config";
import { user } from "@/db/models/auth-schema";
import { auth } from "@/core/auth";
import { eq } from "drizzle-orm";

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
        groups: ["admin"],
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
 * Función principal de bootstrap que se ejecuta al iniciar el backend
 */
export async function bootstrap() {
  console.log("🚀 Iniciando bootstrap...");

  await ensureAdminUser();

  console.log("✅ Bootstrap completado");
}
