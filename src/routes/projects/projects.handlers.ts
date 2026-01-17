import {
  AddProjectRoute,
  DeleteProjectRoute,
  GetProjectByIdtRoute,
  OrderProjectsListRoute,
  ProjectListByTypeRoute,
  ProjectListRoute,
  UpdateProjectRoute,
} from "./projects.routes";
import { AppRouteHandler } from "../../lib/types";
import db from "../../db";
import { projectsTable } from "../../db/schema";
import { OK, NOT_FOUND } from "../../middlewares/helpers/http-status-codes";
import { desc, eq } from "drizzle-orm";

export const projectsListHandler: AppRouteHandler<ProjectListRoute> = async (
  c,
) => {
  const rows = await db.query.projectsTable.findMany({
    orderBy: [desc(projectsTable.order), desc(projectsTable.id)],
  });

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
  c,
) => {
  const project = c.req.valid("json");

  const latestProject = await db.query.projectsTable.findFirst({
    orderBy: [desc(projectsTable.order)],
  });

  const order =
    latestProject?.order && latestProject.order !== 1
      ? latestProject.order + 1
      : 1;

  const [r] = await db
    .insert(projectsTable)
    .values({
      ...project,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date()),
      order,
    })
    .returning();

  return c.json(r, OK);
};

export const projectsListByTypeHandler: AppRouteHandler<
  ProjectListByTypeRoute
> = async (c) => {
  const { type } = c.req.valid("param");
  const rows = await db.query.projectsTable.findMany({
    where: eq(projectsTable.type, type),
    orderBy: [desc(projectsTable.order), desc(projectsTable.id)],
  });

  return c.json(rows, OK);
};

export const updateProjectHandler: AppRouteHandler<UpdateProjectRoute> = async (
  c,
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
    .set({ ...payload, updatedAt: Number(new Date()) })
    .where(eq(projectsTable.id, id))
    .returning();

  return c.json(r, OK);
};

export const deleteProjectHandler: AppRouteHandler<DeleteProjectRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");

  const project = await db.query.projectsTable.findFirst({
    where: eq(projectsTable.id, id),
  });

  if (!project) {
    return c.json({ msg: "Project not found" }, NOT_FOUND);
  }

  await db.delete(projectsTable).where(eq(projectsTable.id, id));

  return c.json({ msg: "Success" }, OK);
};

export const orderProjectListHandler: AppRouteHandler<
  OrderProjectsListRoute
> = async (c) => {
  const payload = c.req.valid("json");

  for (const item of payload) {
    await db
      .update(projectsTable)
      .set({ order: item.order })
      .where(eq(projectsTable.id, item.id));
  }

  return c.json({ msg: "Success" }, OK);
};
