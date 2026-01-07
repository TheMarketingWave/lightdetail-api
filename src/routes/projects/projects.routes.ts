import { createRoute, z } from "@hono/zod-openapi";
import {
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "../../middlewares/helpers/http-status-codes";
import jsonContent from "../../middlewares/helpers/ json-content";
import { addProjectSchema, selectProjectsSchema } from "../../db/schema";
import jsonContentRequired from "../../middlewares/helpers/json-content-required";
import createErrorSchema from "../../middlewares/helpers/create-error-schema";

const coercedInt = z.transform((val: string, ctx) => {
  try {
    const parsed = Number.parseInt(String(val));
    if (Number.isNaN(parsed)) {
      throw new Error("not a number");
    }

    return parsed;
  } catch (e) {
    ctx.issues.push({
      code: "invalid_value",
      message: "Not a number",
      input: val,
      values: [Number.parseInt(String(val))],
    });

    return z.NEVER;
  }
});

const idParamSchema = z.object({
  id: z
    .string()
    .pipe(coercedInt)
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1",
    }),
});

export const projectsListRoute = createRoute({
  tags: ["projects"],
  path: "/projects",
  method: "get",
  responses: {
    [OK]: jsonContent(z.array(selectProjectsSchema), "List of projects"),
  },
});

export type ProjectListRoute = typeof projectsListRoute;

export const getProjectByIdtRoute = createRoute({
  tags: ["projects"],
  path: "/projects/{id}",
  method: "get",
  request: {
    params: idParamSchema,
  },
  responses: {
    [OK]: jsonContent(selectProjectsSchema, "Project found"),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectProjectsSchema),
      "The validation error"
    ),
    [NOT_FOUND]: jsonContent(
      z.object({
        msg: z.string(),
      }),

      "Id not found"
    ),
  },
});

export type GetProjectByIdtRoute = typeof getProjectByIdtRoute;

export const addProjectsRoute = createRoute({
  tags: ["projects"],
  path: "/projects",
  method: "post",
  request: {
    body: jsonContentRequired(addProjectSchema, "Add project"),
  },
  responses: {
    [OK]: jsonContent(selectProjectsSchema, "The created project"),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(addProjectSchema),
      "The validation error"
    ),
  },
});

export type AddProjectRoute = typeof addProjectsRoute;

const typeParamSchema = z.object({
  type: z.enum(["residential", "commercial"]).openapi({
    param: {
      name: "type",
      in: "path",
    },
    example: "residential",
  }),
});

export const projectsListByTypeRoute = createRoute({
  tags: ["projects"],
  path: "/projects/{type}",
  method: "get",
  request: {
    params: typeParamSchema,
  },
  responses: {
    [OK]: jsonContent(
      z.array(selectProjectsSchema),
      "List of projects byt type"
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(typeParamSchema),
      "The validation error"
    ),
  },
});

export type ProjectListByTypeRoute = typeof projectsListByTypeRoute;

export const updateProjectRoute = createRoute({
  tags: ["projects"],
  path: "/projects/{id}",
  method: "patch",
  request: {
    params: idParamSchema,
    body: jsonContentRequired(addProjectSchema.partial(), "Update project"),
  },
  responses: {
    [OK]: jsonContent(selectProjectsSchema, "The created project"),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(idParamSchema.or(addProjectSchema.partial())),
      "The validation error"
    ),
    [NOT_FOUND]: jsonContent(
      z.object({
        msg: z.string(),
      }),

      "Id not found"
    ),
  },
});

export type UpdateProjectRoute = typeof updateProjectRoute;
