import { createRouter } from "../../lib/create-app";
import {
  addProjectHandler,
  deleteProjectHandler,
  getProjectByIdtHandler,
  orderProjectListHandler,
  projectsListByTypeHandler,
  projectsListHandler,
  updateProjectHandler,
} from "./projects.handlers";
import {
  addProjectsRoute,
  deleteProjectRoute,
  getProjectByIdtRoute,
  orderProjectsListRoute,
  projectsListByTypeRoute,
  projectsListRoute,
  updateProjectRoute,
} from "./projects.routes";

const router = createRouter()
  .openapi(projectsListRoute, projectsListHandler)
  .openapi(getProjectByIdtRoute, getProjectByIdtHandler)
  .openapi(projectsListByTypeRoute, projectsListByTypeHandler)
  .openapi(addProjectsRoute, addProjectHandler)
  .openapi(updateProjectRoute, updateProjectHandler)
  .openapi(deleteProjectRoute, deleteProjectHandler)
  .openapi(orderProjectsListRoute, orderProjectListHandler);

export default router;
