import { auth } from "@/core/auth";
import { Context } from "hono";
import { Next } from "hono/types";
import type { User, Session } from "better-auth/types";
import { ErrorEndpoint } from "@/core/endpoint/type/error.endpoint";

export const authMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    const error = new ErrorEndpoint(401, "UNAUTHORIZED", "Unauthorized");
    return c.json(error.getData(), 401);
  }
  c.set("user", session.user as User);
  c.set("session", session.session as Session);
  await next();
};
