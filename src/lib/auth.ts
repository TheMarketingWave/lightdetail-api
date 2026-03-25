import { betterAuth } from "better-auth";
import {
  openAPI,
  admin as adminPlugin,
  bearer,
  createAccessControl,
} from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../db";
import env from "../env";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/admin/access";

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
    bearer(),
    adminPlugin({
      ac,
      roles: {
        admin,
      },
    }),
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: env.NODE_ENV === "production",
      domain: env.COOKIE_DOMAIN,
    },
  },
  trustedOrigins: env.TRUSTED_ORIGINS.split(",").map((o) => o.trim()),
});
