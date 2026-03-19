import { OpenAPIHono } from "@hono/zod-openapi";
import deployRoute from "@/api/v0/deploy";
import stacksRoute from "@/api/v0/stacks/stacks.index";
import apiKeysRoute from "@/api/v0/apikeys/apikeys.index";

const app = new OpenAPIHono();

app.route("/v0", deployRoute);
app.route("/v0/stacks", stacksRoute);
app.route("/v0/apikeys", apiKeysRoute);

export default app;
