import { OpenAPIHono } from "@hono/zod-openapi";
import { deleteRoute } from "./delete.route";
import { deleteHandler } from "./delete.handler";

const router = new OpenAPIHono();

router.openapi(deleteRoute, deleteHandler);

export default router;
