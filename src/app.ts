import configureOpenApi from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import index from "./routes/index.route";
import projects from "./routes/projects/projects.index";
import images from "./routes/images/images.index";

const app = createApp();

const routes = [index, projects, images];

configureOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
