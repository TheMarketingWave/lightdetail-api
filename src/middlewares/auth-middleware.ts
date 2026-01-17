import { RouteConfig, z } from "@hono/zod-openapi";
import { auth } from "../lib/auth";
import { createMiddleware } from "hono/factory";
import { UNAUTHORIZED } from "./helpers/http-status-codes";
import jsonContent from "./helpers/ json-content";

const authMiddleware = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json(
      {
        msg: "Unauthorized",
      },
      UNAUTHORIZED,
    );
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: session?.user.id,
      role: "admin",
      permission: { project: ["create", "update", "delete"] },
    },
  });

  if (!data.success) {
    return c.json(
      {
        msg: "Unauthorized",
      },
      UNAUTHORIZED,
    );
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

export const createProtectedRoute = <R extends RouteConfig>(arg: R): R => {
  return {
    ...arg,
    security: [{ cookieAuth: [] }],
    middleware: [authMiddleware],
    responses: {
      ...arg.responses,
      [UNAUTHORIZED]: jsonContent(
        z.object({
          msg: z.string(),
        }),

        "UNAUTHORIZED",
      ),
    },
  };
};
