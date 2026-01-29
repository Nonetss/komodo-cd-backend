import { Scalar } from "@scalar/hono-api-reference";
import { z, createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { Handler, Context } from "hono";
import { auth } from "@/core/auth";
import type { User, Session } from "better-auth/types";
import { logger } from "hono/logger";
import { bootstrap } from "@/lib/bootstrap";
import api from "@/api";
import { authMiddleware } from "@/middleware";

const app = new OpenAPIHono<{ Variables: { user: User; session: Session } }>();

app.use("*", cors());
app.use("*", logger());
app.use("/api/*", authMiddleware);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

const rootSchema = z.object({
  message: z.string().openapi({ example: "API is running" }),
});

const rootRoute = createRoute({
  method: "get",
  path: "/health-check",
  tags: ["Health Check"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: rootSchema,
        },
      },
      description: "Health Check endpoint",
    },
  },
});

const rootHandler: Handler = (c: Context) => {
  return c.json({ message: "API is running" });
};

app.openapi(rootRoute, rootHandler);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

app.get("/scalar", Scalar({ url: "/doc" }));

app.route("/", api);

// Ejecutar bootstrap al iniciar
bootstrap().then(() => {
  Bun.serve({ port: 3000, fetch: app.fetch });
  console.log("🌐 Servidor corriendo en http://localhost:3000");
});
