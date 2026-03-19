import { Handler, Context } from "hono";
import { komodoService } from "@/services/komodo";
import { logger } from "@/lib/logger";

export const deleteHandler: Handler = async (c: Context) => {
  const { name } = await c.req.json();

  try {
    await komodoService.deleteCredentials(name);
    return c.json(
      {
        success: true,
        message: `Credenciales '${name}' eliminadas correctamente`,
      },
      200,
    );
  } catch (error) {
    logger.error("❌ Error eliminando credenciales:", error);
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      500,
    );
  }
};
