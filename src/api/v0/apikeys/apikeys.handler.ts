import { Context } from "hono";
import { auth } from "@/core/auth";
import { logger } from "@/lib/logger";

// Llama al handler de Better Auth internamente sin red
async function callAuth(
  path: string,
  method: "GET" | "POST" | "DELETE",
  cookie: string,
  body?: unknown,
) {
  const req = new Request(`http://localhost:3000/api/auth${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
      Origin: "http://localhost:3000",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return auth.handler(req);
}

export const listApiKeysHandler = async (c: Context) => {
  const cookie = c.req.header("cookie") ?? "";
  try {
    const res = await callAuth("/api-key/list", "GET", cookie);
    const data = (await res.json()) as any;
    if (!res.ok)
      return c.json({ error: data?.message ?? "Error al listar keys" }, 500);

    const keys = (data?.apiKeys ?? []).map((k: any) => ({
      id: k.id,
      name: k.name ?? null,
      start: k.start ?? null,
      createdAt: k.createdAt
        ? new Date(k.createdAt).toISOString()
        : new Date().toISOString(),
      expiresAt: k.expiresAt ? new Date(k.expiresAt).toISOString() : null,
    }));
    return c.json({ success: true, keys });
  } catch (error: any) {
    logger.error("❌ Error listando API keys:", error?.message);
    return c.json({ error: "Error al listar API keys" }, 500);
  }
};

export const createApiKeyHandler = async (c: Context) => {
  const { name } = await c.req.json();
  const cookie = c.req.header("cookie") ?? "";
  try {
    // Sin userId en el body — la sesión identifica al usuario
    const res = await callAuth("/api-key/create", "POST", cookie, { name });
    const text = await res.text();
    if (!res.ok) {
      logger.error(
        `❌ Better Auth create [${res.status}]:`,
        text.slice(0, 200),
      );
      let msg = "Error al crear key";
      try {
        msg = JSON.parse(text)?.message ?? msg;
      } catch {}
      return c.json({ error: msg }, 500);
    }
    const data = JSON.parse(text);
    return c.json({
      success: true,
      key: data.key,
      id: data.id,
      name: data.name ?? null,
    });
  } catch (error: any) {
    logger.error("❌ Error creando API key:", error?.message);
    return c.json({ error: "Error al crear la API key" }, 500);
  }
};

export const deleteApiKeyHandler = async (c: Context) => {
  const { id } = await c.req.json();
  const cookie = c.req.header("cookie") ?? "";
  try {
    const res = await callAuth("/api-key/delete", "POST", cookie, {
      keyId: id,
    });
    if (!res.ok) {
      const data = (await res.json()) as any;
      return c.json({ error: data?.message ?? "Error al eliminar" }, 500);
    }
    return c.json({ success: true });
  } catch (error: any) {
    logger.error("❌ Error eliminando API key:", error?.message);
    return c.json({ error: "Error al eliminar la API key" }, 500);
  }
};
