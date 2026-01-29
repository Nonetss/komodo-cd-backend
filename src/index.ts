import { Scalar } from "@scalar/hono-api-reference";
import { z, createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { Handler } from "hono";
import { auth } from "@/core/auth";
import { logger } from "hono/logger";
import { bootstrap } from "@/lib/bootstrap";

const app = new OpenAPIHono();

app.use("*", cors());
app.use("*", logger());

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

const rootSchema = z.object({
  message: z.string().openapi({ example: "Hello, World!" }),
});

const rootRoute = createRoute({
  method: "get",
  path: "",
  request: {},
  responses: {
    200: {
      content: {
        "application/json": {
          schema: rootSchema,
        },
      },
      description: "Root endpoint",
    },
  },
});

const rootHandler: Handler = (c) => {
  return c.json({ message: "Hello, World!" });
};

app.openapi(rootRoute, rootHandler);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

app.get("/scalar", Scalar({ url: "/doc" }));

// Ejecutar bootstrap al iniciar
bootstrap().then(() => {
  Bun.serve({ port: 3000, fetch: app.fetch });
  console.log("🌐 Servidor corriendo en http://localhost:3000");
});
