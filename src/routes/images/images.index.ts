import { createRouter } from "../../lib/create-app";
import { deleteImgHandler, getImgHandler, uploadImgHandler } from "./images.handlers";
import { deleteImageRoute, getImageRoute, uploadImageRoute } from "./images.routes";

const router = createRouter()
  .openapi(getImageRoute, getImgHandler)
  .openapi(uploadImageRoute, uploadImgHandler)
  .openapi(deleteImageRoute, deleteImgHandler);

export default router;
