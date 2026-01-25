import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import jsonContent from "../middlewares/helpers/ json-content";
import { OK } from "../middlewares/helpers/http-status-codes";

const router = createRouter().openapi(
  createRoute({
    tags: ["home"],
    method: "get",
    path: "/",
    responses: {
      [OK]: jsonContent(
        z
          .object({
            msg: z.string(),
          })
          .openapi({
            example: {
              msg: "Example string",
            },
          }),
        "LightDetail API Index",
      ),
    },
  }),
  (c) => {
    return c.json({ msg: "Works" }, OK);
  },
);

export default router;
