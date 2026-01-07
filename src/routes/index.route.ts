import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import jsonContent from "../middlewares/helpers/ json-content";
import { OK } from "../middlewares/helpers/http-status-codes";

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
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
        "LightDetail API Index"
      ),
    },
  }),
  (c) => {
    const session = c.var.session;
    const user = c.var.user;
    console.log(session, user);

    return c.json({ msg: "Works" }, OK);
  }
);

export default router;
