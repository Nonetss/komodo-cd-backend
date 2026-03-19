import { auth } from "@/core/auth";
import { Context } from "hono";
import { Next } from "hono/types";
import type { User, Session } from "better-auth/types";

export const authMiddleware = async (c: Context, next: Next) => {
  const apiKeyHeader = c.req.header("x-api-key");

  if (apiKeyHeader) {
    const verifyApiKey = (auth.api as Record<string, Function>)["verifyApiKey"];
    const result = await verifyApiKey({ body: { key: apiKeyHeader } });
    if (!result?.valid || !result?.key) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    c.set("user", { id: result.key.userId } as User);
    c.set("session", null);
    await next();
    return;
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("user", session.user as User);
  c.set("session", session.session as Session);
  await next();
};
