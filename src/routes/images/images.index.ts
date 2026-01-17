import { createRouter } from "../../lib/create-app";
import { uploadImgHandler, getImgHandler } from "./images.handlers";
import { uploadImageRoute, getImageRoute } from "./images.routes";

const router = createRouter()
  .openapi(getImageRoute, getImgHandler)
  .openapi(uploadImageRoute, uploadImgHandler);

export default router;
