import { OpenAPIHono } from "@hono/zod-openapi";
import { historyRoute } from "./history.route";
import { historyHandler } from "./history.handler";

const router = new OpenAPIHono();

router.openapi(historyRoute, historyHandler);

export default router;
