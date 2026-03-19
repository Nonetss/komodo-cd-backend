import { OpenAPIHono } from "@hono/zod-openapi";
import deployRoute from "@/api/v0/deploy";

const app = new OpenAPIHono();

app.route("/v0", deployRoute);

export default app;
