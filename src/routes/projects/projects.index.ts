import { createRouter } from "../../lib/create-app";
import {
  addProjectHandler,
  getProjectByIdtHandler,
  projectsListByTypeHandler,
  projectsListHandler,
  updateProjectHandler,
} from "./projects.handlers";
import {
  addProjectsRoute,
  getProjectByIdtRoute,
  projectsListByTypeRoute,
  projectsListRoute,
  updateProjectRoute,
} from "./projects.routes";

const router = createRouter()
  .openapi(projectsListRoute, projectsListHandler)
  .openapi(getProjectByIdtRoute, getProjectByIdtHandler)
  .openapi(addProjectsRoute, addProjectHandler)
  .openapi(projectsListByTypeRoute, projectsListByTypeHandler)
  .openapi(updateProjectRoute, updateProjectHandler);
export default router;
