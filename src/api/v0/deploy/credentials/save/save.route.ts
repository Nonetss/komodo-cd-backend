import { createRoute } from "@hono/zod-openapi";
import { SaveBodySchema, SaveSchema } from "./save.schema";

export const saveRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Credentials"],
  summary: "Guardar credenciales de Komodo en la base de datos",
  description: "Guardar credenciales de Komodo en la base de datos",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SaveBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SaveSchema,
        },
      },
      description: "Credenciales guardadas",
    },
  },
});
