import { AppOpenApi } from "./types";
import packageJson from "../../package.json";
import { Scalar } from "@scalar/hono-api-reference";
import { auth } from "./auth";
import { pinoLoggerCustom } from "../middlewares/pino-logger";
import { cors } from "hono/cors";

function configureOpenApi(app: AppOpenApi) {
  app.use(pinoLoggerCustom());
  app.use(
    "/*",
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:3001",
        "https://w0ssw8oc4ccw8g8o88co4ggo.themarketingwave.agency",
      ],
      allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );

  app.openAPIRegistry.registerComponent("securitySchemes", "cookieAuth", {
    type: "apiKey",
    in: "cookie",
    name: "better-auth.session_token",
  });

  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJson.version,
      title: "LightDetails API",
    },
  });

  app.get(
    "/reference",
    Scalar({
      sources: [
        { url: "/doc", title: "Api" },
        { url: "/api/auth/open-api/generate-schema", title: "Auth" },
      ],
    }),
  );

  app.on(
    ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    "/api/auth/*",
    (c) => auth.handler(c.req.raw),
  );
}

export default configureOpenApi;
