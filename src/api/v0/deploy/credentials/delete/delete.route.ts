import { createRoute } from "@hono/zod-openapi";
import { DeleteBodySchema, DeleteSchema } from "./delete.schema";

export const deleteRoute = createRoute({
  method: "delete",
  path: "/",
  tags: ["Credentials"],
  summary: "Eliminar credenciales de Komodo",
  description: "Eliminar credenciales de Komodo",
  request: {
    body: {
      content: {
        "application/json": {
          schema: DeleteBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: DeleteSchema,
        },
      },
      description: "Credenciales eliminadas",
    },
  },
});
