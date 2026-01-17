import { betterAuth } from "better-auth";
import {
  openAPI,
  admin as adminPlugin,
  createAccessControl,
} from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../db";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  project: ["create", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const admin = ac.newRole({
  project: ["create", "update", "delete"],
  ...adminAc.statements,
});

export const ADMIN_ROLE = "admin";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  plugins: [
    openAPI(),
    adminPlugin({
      ac,
      roles: {
        admin,
      },
    }),
  ],
  trustedOrigins: ["https://client.scalar.com"],
});
