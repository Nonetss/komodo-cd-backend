import { OpenAPIHono } from "@hono/zod-openapi";
import { triggerRoute } from "./trigger.route";
import { triggerHandler } from "./trigger.handler";

const router = new OpenAPIHono();

router.openapi(triggerRoute, triggerHandler);

export default router;
