import { createRoute } from "@hono/zod-openapi";
import { ListSchema } from "./list.schema";

export const listRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Credentials"],
  summary: "Listar credenciales de Komodo guardadas (sin exponer key/secret)",
  description:
    "Listar credenciales de Komodo guardadas (sin exponer key/secret)",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ListSchema,
        },
      },
      tags: ["Credentials"],
      description:
        "Listar credenciales de Komodo guardadas (sin exponer key/secret)",
    },
  },
});
