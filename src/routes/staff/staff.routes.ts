import { createRoute, z } from "@hono/zod-openapi";
import {
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "../../middlewares/helpers/http-status-codes";
import jsonContent from "../../middlewares/helpers/ json-content";
import {
  addStaffTableSchema,
  selectStaffTableSchema,
  updateStaffTableSchema,
} from "../../db/schema";
import { createProtectedRoute } from "../../middlewares/auth-middleware";
import jsonContentRequired from "../../middlewares/helpers/json-content-required";
import createErrorSchema from "../../middlewares/helpers/create-error-schema";
import { idParamSchema } from "../../middlewares/helpers/id-parama-schema";

export const staffListRoute = createRoute({
  tags: ["staff"],
  path: "/staff",
  method: "get",
  responses: {
    [OK]: jsonContent(z.array(selectStaffTableSchema), "List of staff members"),
  },
});

export type StaffListRoute = typeof staffListRoute;

export const addStaffRoute = createProtectedRoute({
  tags: ["staff"],
  path: "/staff/add",
  method: "post",
  request: {
    body: jsonContentRequired(addStaffTableSchema, "Add staff member"),
  },
  responses: {
    [OK]: jsonContent(selectStaffTableSchema, "The created staff member"),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(addStaffTableSchema),
      "The validation error",
    ),
  },
});

export type AddStaffRoute = typeof addStaffRoute;

export const updateStaffRoute = createProtectedRoute({
  tags: ["staff"],
  path: "/staff/update/{id}",
  method: "put",
  request: {
    params: idParamSchema,
    body: jsonContentRequired(updateStaffTableSchema, "Update staff member"),
  },
  responses: {
    [OK]: jsonContent(selectStaffTableSchema, "The updated staff member"),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(addStaffTableSchema),
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

export type UpdateStaffRoute = typeof updateStaffRoute;

export const deleteStaffRoute = createProtectedRoute({
  tags: ["staff"],
  path: "/staff/delete/{id}",
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

export type DeleteStaffRoute = typeof deleteStaffRoute;
