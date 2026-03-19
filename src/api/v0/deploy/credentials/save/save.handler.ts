import { Handler, Context } from "hono";
import { komodoService } from "@/services/komodo";
import { logger } from "@/lib/logger";

export const saveHandler: Handler = async (c: Context) => {
  const { name, url, key, secret } = await c.req.json();

  try {
    await komodoService.updateCredentials(name, url, key, secret);
    return c.json(
      {
        success: true,
        message: `Credenciales '${name}' guardadas correctamente`,
        name,
      },
      200,
    );
  } catch (error) {
    logger.error("❌ Error guardando credenciales:", error);
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
        name,
      },
      500,
    );
  }
};
