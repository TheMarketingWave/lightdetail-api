import { z, ZodError } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(Bun.env);
} catch (e) {
  const err = e as ZodError;
  console.log(err);

  console.error("Invalid env:");
  console.error(z.prettifyError(err));
  process.exit(1);
}

export default env;
