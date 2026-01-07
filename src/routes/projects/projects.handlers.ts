import {
  AddProjectRoute,
  GetProjectByIdtRoute,
  ProjectListByTypeRoute,
  ProjectListRoute,
  UpdateProjectRoute,
} from "./projects.routes";
import { AppRouteHandler } from "../../lib/types";
import db from "../../db";
import { projectsTable } from "../../db/schema";
import { OK, NOT_FOUND } from "../../middlewares/helpers/http-status-codes";
import { eq } from "drizzle-orm";

export const projectsListHandler: AppRouteHandler<ProjectListRoute> = async (
  c
) => {
  const rows = await db.query.projectsTable.findMany();

  return c.json(rows);
};

export const getProjectByIdtHandler: AppRouteHandler<
  GetProjectByIdtRoute
> = async (c) => {
  const { id } = c.req.valid("param");

  const project = await db.query.projectsTable.findFirst({
    where: eq(projectsTable.id, id),
  });

  if (!project) {
    return c.json({ msg: "Project not found" }, NOT_FOUND);
  }

  return c.json(project, OK);
};

export const addProjectHandler: AppRouteHandler<AddProjectRoute> = async (
  c
) => {
  const project = c.req.valid("json");

  const [r] = await db.insert(projectsTable).values(project).returning();

  return c.json(r, OK);
};

export const projectsListByTypeHandler: AppRouteHandler<
  ProjectListByTypeRoute
> = async (c) => {
  const { type } = c.req.valid("param");
  const rows = await db.query.projectsTable.findMany({
    where(fields, operators) {
      return operators.eq(fields.type, type);
    },
  });

  return c.json(rows, OK);
};

export const updateProjectHandler: AppRouteHandler<UpdateProjectRoute> = async (
  c
) => {
  const { id } = c.req.valid("param");
  const payload = c.req.valid("json");

  const project = await db.query.projectsTable.findFirst({
    where: eq(projectsTable.id, id),
  });

  if (!project) {
    return c.json({ msg: "Project not found" }, NOT_FOUND);
  }

  const [r] = await db
    .update(projectsTable)
    .set(payload)
    .where(eq(projectsTable.id, id))
    .returning();

  return c.json(r, OK);
};
