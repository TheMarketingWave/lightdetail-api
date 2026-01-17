import { createRoute, z } from "@hono/zod-openapi";
import {
  INTERNAL_SERVER_ERROR,
  OK,
} from "../../middlewares/helpers/http-status-codes";
import jsonContent from "../../middlewares/helpers/ json-content";

export const uploadImageRoute = createRoute({
  tags: ["images"],
  path: "/images/upload",
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
      "Image id",
    ),
    [INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string() }),
      "Error processing img",
    ),
  },
});

export type UploadImageRoute = typeof uploadImageRoute;

export const getImageRoute = createRoute({
  tags: ["images"],
  path: "/images/get/{id}",
  method: "get",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [OK]: {
      description: "Image File",
      content: {
        "image/webp": {
          schema: z.string().openapi({ format: "binary" }),
        },
      },
    },
  },
});

export type GetImageRoute = typeof getImageRoute;
