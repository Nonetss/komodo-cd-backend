import { OpenAPIHono } from "@hono/zod-openapi";
import { stacksRoute } from "./stacks.route";
import { stacksHandler } from "./stacks.handler";

const router = new OpenAPIHono();

router.openapi(stacksRoute, stacksHandler);

export default router;
