import { OpenAPIHono } from "@hono/zod-openapi";
import { AppBindings } from "./types";
import { pinoLoggerCustom } from "../middlewares/pino-logger";
import notFound from "../middlewares/not-found";
import onError from "../middlewares/on-error";
import defaultHook from "../middlewares/helpers/default-hook";
import { auth } from "./auth";
import { authMiddleware } from "../middlewares/auth-middleware";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(pinoLoggerCustom());
  app.use(authMiddleware);

  app.notFound(notFound);
  app.onError(onError);

  app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

  return app;
}
