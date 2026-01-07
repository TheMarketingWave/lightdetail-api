import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import env from "../env";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

import * as schema from "./schema";

const db = drizzle(client, {
  schema,
});

export default db;
