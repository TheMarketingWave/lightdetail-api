import { createRoute, z } from "@hono/zod-openapi";
import {
  BAD_REQUEST,
  NOT_FOUND,
  OK,
} from "../../middlewares/helpers/http-status-codes";
import jsonContent from "../../middlewares/helpers/ json-content";
import { addContentSchema } from "../../db/schema";

const contentTypeEnum = z.enum(["text", "image", "video", "section", "list"]);

const contentItemSchema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.string().nullable(),
  type: contentTypeEnum,
  parentId: z.number().nullable(),
  order: z.number().nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  createdAt: z.number().nullable(),
  updatedAt: z.number().nullable(),
});

export const listContentRoute = createRoute({
  tags: ["content"],
  path: "/content",
  method: "get",
  responses: {
    [OK]: jsonContent(z.array(contentItemSchema), "All content items"),
  },
});

export type ListContentRoute = typeof listContentRoute;

export const getContentTreeRoute = createRoute({
  tags: ["content"],
  path: "/content/tree",
  method: "get",
  responses: {
    [OK]: {
      description: "Full nested content tree",
      content: {
        "application/json": {
          schema: z.array(contentItemSchema),
        },
      },
    },
  },
});

export type GetContentTreeRoute = typeof getContentTreeRoute;

export const getContentTreeByKeyRoute = createRoute({
  tags: ["content"],
  path: "/content/tree/{key}",
  method: "get",
  request: {
    params: z.object({
      key: z.string(),
    }),
  },
  responses: {
    [OK]: {
      description: "Subtree rooted at key",
      content: {
        "application/json": {
          schema: contentItemSchema,
        },
      },
    },
    [NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "Content not found",
    ),
  },
});

export type GetContentTreeByKeyRoute = typeof getContentTreeByKeyRoute;

export const getContentByIdRoute = createRoute({
  tags: ["content"],
  path: "/content/{id}",
  method: "get",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [OK]: jsonContent(contentItemSchema, "Single content item"),
    [NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "Content not found",
    ),
  },
});

export type GetContentByIdRoute = typeof getContentByIdRoute;

export const addContentRoute = createRoute({
  tags: ["content"],
  path: "/content/add",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: addContentSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    [OK]: jsonContent(contentItemSchema, "Created content item"),
    [BAD_REQUEST]: jsonContent(
      z.object({ message: z.string() }),
      "Invalid request",
    ),
  },
});

export type AddContentRoute = typeof addContentRoute;

export const updateContentRoute = createRoute({
  tags: ["content"],
  path: "/content/update/{id}",
  method: "put",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            key: z.string().min(1).optional(),
            value: z.string().nullable().optional(),
            type: contentTypeEnum.optional(),
            parentId: z.number().nullable().optional(),
            order: z.number().optional(),
            metadata: z.record(z.string(), z.unknown()).nullable().optional(),
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    [OK]: jsonContent(contentItemSchema, "Updated content item"),
    [NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "Content not found",
    ),
  },
});

export type UpdateContentRoute = typeof updateContentRoute;

export const deleteContentRoute = createRoute({
  tags: ["content"],
  path: "/content/delete/{id}",
  method: "delete",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [OK]: jsonContent(
      z.object({ message: z.string() }),
      "Content deleted successfully",
    ),
    [NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "Content not found",
    ),
  },
});

export type DeleteContentRoute = typeof deleteContentRoute;

export const reorderContentRoute = createRoute({
  tags: ["content"],
  path: "/content/order",
  method: "put",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              id: z.number(),
              order: z.number(),
            }),
          ),
        },
      },
      required: true,
    },
  },
  responses: {
    [OK]: jsonContent(
      z.object({ message: z.string() }),
      "Content reordered successfully",
    ),
  },
});

export type ReorderContentRoute = typeof reorderContentRoute;
