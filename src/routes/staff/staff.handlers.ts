import db from "../../db";
import { desc, eq } from "drizzle-orm";
import { staffTable } from "../../db/schema";
import { AppRouteHandler } from "../../lib/types";
import {
  AddStaffRoute,
  DeleteStaffRoute,
  StaffListRoute,
  UpdateStaffRoute,
} from "./staff.routes";
import { NOT_FOUND, OK } from "../../middlewares/helpers/http-status-codes";

export const staffListHandler: AppRouteHandler<StaffListRoute> = async (c) => {
  const rows = await db.query.staffTable.findMany({
    orderBy: desc(staffTable.id),
  });

  return c.json(rows, OK);
};

export const addStaffHandler: AppRouteHandler<AddStaffRoute> = async (c) => {
  const payload = c.req.valid("json");

  const [r] = await db
    .insert(staffTable)
    .values({
      ...payload,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date()),
    })
    .returning();

  return c.json(r, OK);
};

export const updateStaffHandler: AppRouteHandler<UpdateStaffRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");
  const payload = c.req.valid("json");

  const project = await db.query.staffTable.findFirst({
    where: eq(staffTable.id, id),
  });

  if (!project) {
    return c.json({ msg: "Project not found" }, NOT_FOUND);
  }

  const [r] = await db
    .update(staffTable)
    .set({ ...payload, updatedAt: Number(new Date()) })
    .where(eq(staffTable.id, id))
    .returning();

  return c.json(r, OK);
};

export const deleteStaffHandler: AppRouteHandler<DeleteStaffRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");

  const staffMember = await db.query.staffTable.findFirst({
    where: eq(staffTable.id, id),
  });

  if (!staffMember) {
    return c.json({ msg: "Staff member not found" }, NOT_FOUND);
  }

  await db.delete(staffTable).where(eq(staffTable.id, id));

  return c.json({ msg: "Success" }, OK);
};
