import { eq, isNull, sql } from "drizzle-orm";
import db from "../../db";
import { contentTable } from "../../db/schema";
import { AppRouteHandler } from "../../lib/types";
import {
  BAD_REQUEST,
  NOT_FOUND,
  OK,
} from "../../middlewares/helpers/http-status-codes";
import {
  AddContentRoute,
  DeleteContentRoute,
  GetContentByIdRoute,
  GetContentTreeByKeyRoute,
  GetContentTreeRoute,
  ListContentRoute,
  ReorderContentRoute,
  UpdateContentRoute,
} from "./content.routes";

type ContentRow = typeof contentTable.$inferSelect;
type ContentTreeNode = ContentRow & { children: ContentTreeNode[] };

function buildTree(rows: ContentRow[]): ContentTreeNode[] {
  const map = new Map<number, ContentTreeNode>();
  const roots: ContentTreeNode[] = [];

  for (const row of rows) {
    map.set(row.id, { ...row, children: [] });
  }

  for (const node of map.values()) {
    if (node.parentId !== null) {
      const parent = map.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  function sortChildren(nodes: ContentTreeNode[]) {
    nodes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const node of nodes) {
      sortChildren(node.children);
    }
  }

  sortChildren(roots);
  return roots;
}

function collectDescendantIds(id: number, rows: ContentRow[]): number[] {
  const ids: number[] = [id];
  const children = rows.filter((r) => r.parentId === id);
  for (const child of children) {
    ids.push(...collectDescendantIds(child.id, rows));
  }
  return ids;
}

export const listContentHandler: AppRouteHandler<ListContentRoute> = async (
  c,
) => {
  const rows = await db.select().from(contentTable);
  return c.json(rows, OK);
};

export const getContentTreeHandler: AppRouteHandler<
  GetContentTreeRoute
> = async (c) => {
  const rows = await db.select().from(contentTable);
  const tree = buildTree(rows);
  return c.json(tree, OK);
};

export const getContentTreeByKeyHandler: AppRouteHandler<
  GetContentTreeByKeyRoute
> = async (c) => {
  const { key } = c.req.valid("param");
  const rows = await db.select().from(contentTable);
  const tree = buildTree(rows);

  function findNode(
    nodes: ContentTreeNode[],
    key: string,
  ): ContentTreeNode | null {
    for (const node of nodes) {
      if (node.key === key) return node;
      const found = findNode(node.children, key);
      if (found) return found;
    }
    return null;
  }

  const node = findNode(tree, key);
  if (!node) {
    return c.json({ message: "Content not found" }, NOT_FOUND);
  }

  return c.json(node, OK);
};

export const getContentByIdHandler: AppRouteHandler<
  GetContentByIdRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const [item] = await db
    .select()
    .from(contentTable)
    .where(eq(contentTable.id, Number(id)));

  if (!item) {
    return c.json({ message: "Content not found" }, NOT_FOUND);
  }

  return c.json(item, OK);
};

export const addContentHandler: AppRouteHandler<AddContentRoute> = async (
  c,
) => {
  const body = c.req.valid("json");
  const now = Date.now();

  if (body.parentId !== undefined && body.parentId !== null) {
    const [parent] = await db
      .select()
      .from(contentTable)
      .where(eq(contentTable.id, body.parentId));

    if (!parent) {
      return c.json({ message: "Parent not found" }, BAD_REQUEST);
    }

    if (parent.type !== "section") {
      return c.json(
        { message: "Parent must be a section type" },
        BAD_REQUEST,
      );
    }
  }

  // Auto-ordering: get max order among siblings
  let order = body.order ?? 0;
  if (body.order === undefined || body.order === null) {
    const [maxOrder] = await db
      .select({ max: sql<number>`COALESCE(MAX(${contentTable.order}), -1)` })
      .from(contentTable)
      .where(
        body.parentId
          ? eq(contentTable.parentId, body.parentId)
          : isNull(contentTable.parentId),
      );
    order = (maxOrder?.max ?? -1) + 1;
  }

  try {
    const [item] = await db
      .insert(contentTable)
      .values({
        key: body.key,
        value: body.value,
        type: body.type,
        parentId: body.parentId,
        metadata: body.metadata,
        order,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return c.json(item, OK);
  } catch (error) {
    console.log(error);

    return c.json({ message: "failed insert" }, BAD_REQUEST);
  }
};

export const updateContentHandler: AppRouteHandler<UpdateContentRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const now = Date.now();

  const [existing] = await db
    .select()
    .from(contentTable)
    .where(eq(contentTable.id, Number(id)));

  if (!existing) {
    return c.json({ message: "Content not found" }, NOT_FOUND);
  }

  const [item] = await db
    .update(contentTable)
    .set({
      ...body,
      updatedAt: now,
    })
    .where(eq(contentTable.id, Number(id)))
    .returning();

  return c.json(item, OK);
};

export const deleteContentHandler: AppRouteHandler<DeleteContentRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");
  const numId = Number(id);

  const rows = await db.select().from(contentTable);
  const existing = rows.find((r) => r.id === numId);

  if (!existing) {
    return c.json({ message: "Content not found" }, NOT_FOUND);
  }

  // Cascade delete: collect all descendant IDs
  const idsToDelete = collectDescendantIds(numId, rows);

  for (const deleteId of idsToDelete) {
    await db.delete(contentTable).where(eq(contentTable.id, deleteId));
  }

  return c.json({ message: "Content deleted successfully" }, OK);
};

export const reorderContentHandler: AppRouteHandler<
  ReorderContentRoute
> = async (c) => {
  const items = c.req.valid("json");

  for (const item of items) {
    await db
      .update(contentTable)
      .set({ order: item.order, updatedAt: Date.now() })
      .where(eq(contentTable.id, item.id));
  }

  return c.json({ message: "Content reordered successfully" }, OK);
};
