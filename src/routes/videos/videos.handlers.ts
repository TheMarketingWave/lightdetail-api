import { AppRouteHandler } from "../../lib/types";
import { NOT_FOUND, OK } from "../../middlewares/helpers/http-status-codes";
import {
  DeleteVideoRoute,
  GetVideoRoute,
  UploadVideoRoute,
} from "./videos.routes";
import { basename, extname } from "node:path";

const LIMIT_50MB = 50 * 1024 * 1024;
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const TYPE_TO_EXT: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

export const uploadVideoHandler: AppRouteHandler<UploadVideoRoute> = async (
  c,
) => {
  const body = await c.req.parseBody();
  const file = body.file as File;

  try {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return c.json(
        { error: "Invalid file type. Accepted: mp4, webm, mov" },
        500,
      );
    }

    if (file.size > LIMIT_50MB) {
      return c.json({ error: "File too large. Max 50MB" }, 500);
    }

    const ext = TYPE_TO_EXT[file.type] || extname(file.name);
    const filename = `video_${Date.now()}${ext}`;
    const savePath = `./data/uploads/${filename}`;

    await Bun.write(savePath, file);

    return c.json(
      {
        message: "Video saved successfully",
        filename,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      },
      OK,
    );
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to upload video" }, 500);
  }
};

export const getVideoHandler: AppRouteHandler<GetVideoRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const filename = basename(id);

  const path = `./data/uploads/${filename}`;

  const file = Bun.file(path);
  if (!(await file.exists())) {
    return c.notFound();
  }

  return new Response(file);
};

export const deleteVideoHandler: AppRouteHandler<DeleteVideoRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");
  const filename = basename(id);

  const path = `./data/uploads/${filename}`;

  const file = Bun.file(path);
  if (!(await file.exists())) {
    return c.json({ message: "Video not found" }, NOT_FOUND);
  }

  await file.delete();

  return c.json({ message: "Video deleted successfully" }, OK);
};
