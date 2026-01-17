import sharp from "sharp";
import { AppRouteHandler } from "../../lib/types";
import { OK } from "../../middlewares/helpers/http-status-codes";
import { GetImageRoute, UploadImageRoute } from "./images.routes";
import { basename } from "node:path";

const LIMIT_1MB = 1 * 1024 * 1024;

export const uploadImgHandler: AppRouteHandler<UploadImageRoute> = async (
  c
) => {
  const body = await c.req.parseBody();
  const file = body.file as File;
  const filename = `image_${Date.now()}.webp`;
  const savePath = `./uploads/${filename}`;

  try {
    if (file.type === "image/webp" && file.size < LIMIT_1MB) {
      await Bun.write(savePath, file);

      return c.json(
        {
          message: "Image saved successfully",
          filename,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        },
        OK
      );
    }

    const arrayBuffer = await (file as File).arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    let processedBuffer = await sharp(inputBuffer)
      .webp({ quality: 100 })
      .toBuffer();

    if (processedBuffer.byteLength > LIMIT_1MB) {
      processedBuffer = await sharp(inputBuffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 100 })
        .toBuffer();
    }

    await Bun.write(savePath, processedBuffer);

    return c.json(
      {
        message: "Image saved successfully",
        filename,
        size: `${(processedBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`,
      },
      OK
    );
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to process image" }, 500);
  }
};

export const getImgHandler: AppRouteHandler<GetImageRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const filename = basename(id);

  const path = `./uploads/${filename}`;

  const file = Bun.file(path);
  if (!(await file.exists())) {
    return c.notFound();
  }

  return new Response(file);
};
