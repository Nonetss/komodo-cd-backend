import { OpenAPIHono } from "@hono/zod-openapi";
import { saveRoute } from "./save.route";
import { saveHandler } from "./save.handler";

const router = new OpenAPIHono();

router.openapi(saveRoute, saveHandler);

export default router;
