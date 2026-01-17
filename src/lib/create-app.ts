import { OpenAPIHono } from "@hono/zod-openapi";
import { AppBindings } from "./types";
import notFound from "../middlewares/not-found";
import onError from "../middlewares/on-error";
import defaultHook from "../middlewares/helpers/default-hook";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
