import { z } from "@hono/zod-openapi";

export const TriggerBodySchema = z.object({
  stack: z.string().openapi({ example: "mi-stack" }),
  action: z
    .enum(["build", "pull", "redeploy", "build-pull-redeploy"])
    .openapi({ example: "build-pull-redeploy" }),
});

export const TriggerSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Deploy iniciado correctamente" }),
  stack: z.string().openapi({ example: "mi-stack" }),
  action: z.string().openapi({ example: "build-pull-redeploy" }),
});
