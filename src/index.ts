import app from "./app";
import env from "./env";

const port = env.PORT;

export default {
  port,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};
