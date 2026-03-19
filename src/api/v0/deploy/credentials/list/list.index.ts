import { OpenAPIHono } from "@hono/zod-openapi";
import { listRoute } from "./list.route";
import { listHandler } from "./list.handler";

const router = new OpenAPIHono();

router.openapi(listRoute, listHandler);

export default router;
