import { createRouter } from "../../lib/create-app";
import {
  addStaffHandler,
  deleteStaffHandler,
  staffListHandler,
  updateStaffHandler,
} from "./staff.handlers";
import {
  addStaffRoute,
  deleteStaffRoute,
  staffListRoute,
  updateStaffRoute,
} from "./staff.routes";

const router = createRouter()
  .openapi(staffListRoute, staffListHandler)
  .openapi(addStaffRoute, addStaffHandler)
  .openapi(updateStaffRoute, updateStaffHandler)
  .openapi(deleteStaffRoute, deleteStaffHandler);

export default router;
