import { Handler, Context } from "hono";
import { komodoService } from "@/services/komodo";
import { logger } from "@/lib/logger";

export const stacksHandler: Handler = async (c: Context) => {
  try {
    const stacks = await komodoService.listAllStacks();
    return c.json({ success: true, stacks }, 200);
  } catch (error) {
    logger.error("❌ Error listando stacks:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      500,
    );
  }
};
