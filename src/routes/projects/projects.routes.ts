import { createRoute, z } from "@hono/zod-openapi";
import {
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "../../middlewares/helpers/http-status-codes";
import jsonContent from "../../middlewares/helpers/ json-content";
import {
  addProjectSchema,
  selectProjectsSchema,
  updateProjectSchema,
} from "../../db/schema";
import jsonContentRequired from "../../middlewares/helpers/json-content-required";
import createErrorSchema from "../../middlewares/helpers/create-error-schema";
import { createProtectedRoute } from "../../middlewares/auth-middleware";
import { idParamSchema } from "../../middlewares/helpers/id-parama-schema";

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
      "The validation error",
    ),
    [NOT_FOUND]: jsonContent(
      z.object({
        msg: z.string(),
      }),

      "Id not found",
    ),
  },
});

export type GetProjectByIdtRoute = typeof getProjectByIdtRoute;

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
  path: "/projects/type/{type}",
  method: "get",
  request: {
    params: typeParamSchema,
  },
  responses: {
    [OK]: jsonContent(
      z.array(selectProjectsSchema),
      "List of projects byt type",
    ),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(typeParamSchema),
      "The validation error",
    ),
  },
});

export type ProjectListByTypeRoute = typeof projectsListByTypeRoute;

export const addProjectsRoute = createProtectedRoute({
  tags: ["projects"],
  path: "/projects/add",
  method: "post",
  request: {
    body: jsonContentRequired(addProjectSchema, "Add project"),
  },
  responses: {
    [OK]: jsonContent(selectProjectsSchema, "The created project"),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(addProjectSchema),
      "The validation error",
    ),
  },
});

export type AddProjectRoute = typeof addProjectsRoute;

export const updateProjectRoute = createProtectedRoute({
  tags: ["projects"],
  path: "/projects/update/{id}",
  method: "put",
  request: {
    params: idParamSchema,
    body: jsonContentRequired(updateProjectSchema, "Update project"),
  },
  responses: {
    [OK]: jsonContent(selectProjectsSchema, "The created project"),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(idParamSchema.or(updateProjectSchema)),
      "The validation error",
    ),
    [NOT_FOUND]: jsonContent(
      z.object({
        msg: z.string(),
      }),
      "Id not found",
    ),
  },
});

export type UpdateProjectRoute = typeof updateProjectRoute;

export const deleteProjectRoute = createProtectedRoute({
  tags: ["projects"],
  path: "/projects/delete/{id}",
  method: "delete",
  request: {
    params: idParamSchema,
  },
  responses: {
    [OK]: jsonContent(
      z.object({ msg: z.string() }),
      "The success of operation",
    ),
    [NOT_FOUND]: jsonContent(
      z.object({
        msg: z.string(),
      }),
      "Id not found",
    ),
  },
});

export type DeleteProjectRoute = typeof deleteProjectRoute;

export const orderProjectsListRoute = createProtectedRoute({
  tags: ["projects"],
  path: "/projects/order",
  method: "put",
  request: {
    body: jsonContentRequired(
      z.array(
        z.object({
          id: z.number(),
          order: z.number(),
        }),
      ),
      "Order projects",
    ),
  },
  responses: {
    [OK]: jsonContent(
      z.object({ msg: z.string() }),
      "The success of operation",
    ),
  },
});

export type OrderProjectsListRoute = typeof orderProjectsListRoute;
