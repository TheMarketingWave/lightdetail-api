import { AppOpenApi } from "./types";
import packageJson from "../../package.json";
import { Scalar } from "@scalar/hono-api-reference";

function configureOpenApi(app: AppOpenApi) {
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
    })
  );
}

export default configureOpenApi;
