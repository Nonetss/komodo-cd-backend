import { OpenAPIHono } from "@hono/zod-openapi";
import {
  listApiKeysRoute,
  createApiKeyRoute,
  deleteApiKeyRoute,
} from "./apikeys.route";
import {
  listApiKeysHandler,
  createApiKeyHandler,
  deleteApiKeyHandler,
} from "./apikeys.handler";

const router = new OpenAPIHono();

router.openapi(listApiKeysRoute, listApiKeysHandler);
router.openapi(createApiKeyRoute, createApiKeyHandler);
router.openapi(deleteApiKeyRoute, deleteApiKeyHandler);

export default router;
