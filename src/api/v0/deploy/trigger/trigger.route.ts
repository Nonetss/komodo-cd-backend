import { createRoute } from "@hono/zod-openapi";
import { TriggerSchema } from "./trigger.schema";

export const triggerRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Deploy"],
  summary:
    "Disparar un deploy en Komodo. Compatible con GitHub Actions y Gitea.",
  description:
    "Disparar un deploy en Komodo. Compatible con GitHub Actions y Gitea.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: TriggerSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: TriggerSchema,
        },
      },
      description: "Deploy ejecutado correctamente",
    },
  },
});
