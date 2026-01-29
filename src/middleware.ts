import { auth } from "@/core/auth";
import { Context } from "hono";
import { Next } from "hono/types";
import type { User, Session } from "better-auth/types";

export const authMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("user", session.user as User);
  c.set("session", session.session as Session);
  await next();
};
