import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import env from "../env";

const client = createClient({
  url: env.DATABASE_URL,
});

import * as schema from "./schema";

const db = drizzle(client, {
  schema,
});

export default db;
