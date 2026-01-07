import { pinoLogger } from "hono-pino";
import { pino } from "pino";
import env from "../env";

export function pinoLoggerCustom() {
  return pinoLogger({
    pino: pino({
      level: env.LOG_LEVEL ?? "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    }),
  });
}
