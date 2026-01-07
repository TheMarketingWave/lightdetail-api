import { OpenAPIHono, RouteConfig, RouteHandler, z } from "@hono/zod-openapi";
import { PinoLogger } from "hono-pino";
import { auth } from "./auth";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}

export type AppOpenApi = OpenAPIHono<AppBindings>;

export type ZodSchema = z.ZodUnion | z.ZodObject | z.ZodArray<z.ZodObject>;
export type ZodIssue = z.core.$ZodIssue;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
