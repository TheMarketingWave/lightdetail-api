import { createRouter } from "../../lib/create-app";
import {
  addContentHandler,
  deleteContentHandler,
  getContentByIdHandler,
  getContentTreeByKeyHandler,
  getContentTreeHandler,
  listContentHandler,
  reorderContentHandler,
  updateContentHandler,
} from "./content.handlers";
import {
  addContentRoute,
  deleteContentRoute,
  getContentByIdRoute,
  getContentTreeByKeyRoute,
  getContentTreeRoute,
  listContentRoute,
  reorderContentRoute,
  updateContentRoute,
} from "./content.routes";

const router = createRouter()
  .openapi(listContentRoute, listContentHandler)
  .openapi(getContentTreeRoute, getContentTreeHandler)
  .openapi(getContentTreeByKeyRoute, getContentTreeByKeyHandler)
  .openapi(getContentByIdRoute, getContentByIdHandler)
  .openapi(addContentRoute, addContentHandler)
  .openapi(updateContentRoute, updateContentHandler)
  .openapi(deleteContentRoute, deleteContentHandler)
  .openapi(reorderContentRoute, reorderContentHandler);

export default router;
