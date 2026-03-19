import { Handler, Context } from "hono";
import { komodoService } from "@/services/komodo";
import { logger } from "@/lib/logger";

export const triggerHandler: Handler = async (c: Context) => {
  const { stack, action } = await c.req.json();
  logger.info(`🚀 Deploy trigger — stack: ${stack}, action: ${action}`);

  try {
    if (action === "pull") {
      await komodoService.pullImage(stack);
    }
    if (action === "redeploy") {
      await komodoService.redeploy(stack);
    }

    return c.json(
      {
        success: true,
        message: `Acción '${action}' completada para '${stack}'`,
        stack,
        action,
      },
      200,
    );
  } catch (error) {
    logger.error(`❌ Error en deploy — stack: ${stack}:`, error);
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
        stack,
        action,
      },
      500,
    );
  }
};
