import { createRouter } from "../../lib/create-app";
import {
  deleteVideoHandler,
  getVideoHandler,
  uploadVideoHandler,
} from "./videos.handlers";
import {
  deleteVideoRoute,
  getVideoRoute,
  uploadVideoRoute,
} from "./videos.routes";

const router = createRouter()
  .openapi(getVideoRoute, getVideoHandler)
  .openapi(uploadVideoRoute, uploadVideoHandler)
  .openapi(deleteVideoRoute, deleteVideoHandler);

export default router;
