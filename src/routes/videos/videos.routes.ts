import { createRoute, z } from "@hono/zod-openapi";
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../../middlewares/helpers/http-status-codes";
import jsonContent from "../../middlewares/helpers/ json-content";

export const uploadVideoRoute = createRoute({
  tags: ["videos"],
  path: "/videos/upload",
  method: "post",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            file: z
              .custom<File>((v) => v instanceof File)
              .openapi({
                type: "string",
                format: "binary",
              }),
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    [OK]: jsonContent(
      z.object({
        message: z.string(),
        filename: z.string(),
        size: z.string(),
      }),
      "Video uploaded successfully",
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Error uploading video",
    ),
  },
});

export type UploadVideoRoute = typeof uploadVideoRoute;

export const getVideoRoute = createRoute({
  tags: ["videos"],
  path: "/videos/get/{id}",
  method: "get",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [OK]: {
      description: "Video File",
      content: {
        "video/mp4": {
          schema: z.string().openapi({ format: "binary" }),
        },
      },
    },
  },
});

export type GetVideoRoute = typeof getVideoRoute;

export const deleteVideoRoute = createRoute({
  tags: ["videos"],
  path: "/videos/delete/{id}",
  method: "delete",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Video deleted successfully",
    ),
    [NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Video not found",
    ),
  },
});

export type DeleteVideoRoute = typeof deleteVideoRoute;
