import { Context } from "hono";
import { auth } from "@/core/auth";
import { logger } from "@/lib/logger";
import type { User } from "better-auth/types";

export const listApiKeysHandler = async (c: Context) => {
  const user = c.get("user") as User;
  try {
    const result = await (auth.api as any).listApiKeys({
      query: { userId: user.id },
      headers: c.req.raw.headers,
    });
    const keys = (result ?? []).map((k: any) => ({
      id: k.id,
      name: k.name ?? null,
      start: k.start ?? null,
      createdAt: k.createdAt
        ? new Date(k.createdAt).toISOString()
        : new Date().toISOString(),
      expiresAt: k.expiresAt ? new Date(k.expiresAt).toISOString() : null,
    }));
    return c.json({ success: true, keys });
  } catch (error) {
    logger.error("❌ Error listando API keys:", error);
    return c.json({ error: "Error al listar API keys" }, 500);
  }
};

export const createApiKeyHandler = async (c: Context) => {
  const user = c.get("user") as User;
  const { name } = await c.req.json();
  try {
    const result = await (auth.api as any).createApiKey({
      body: { name, userId: user.id },
      headers: c.req.raw.headers,
    });
    return c.json({
      success: true,
      key: result.key,
      id: result.id,
      name: result.name ?? null,
    });
  } catch (error) {
    logger.error("❌ Error creando API key:", error);
    return c.json({ error: "Error al crear la API key" }, 500);
  }
};

export const deleteApiKeyHandler = async (c: Context) => {
  const { id } = await c.req.json();
  try {
    await (auth.api as any).deleteApiKey({
      body: { keyId: id },
      headers: c.req.raw.headers,
    });
    return c.json({ success: true });
  } catch (error) {
    logger.error("❌ Error eliminando API key:", error);
    return c.json({ error: "Error al eliminar la API key" }, 500);
  }
};
