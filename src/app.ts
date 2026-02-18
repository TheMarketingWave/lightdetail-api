import configureOpenApi from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import index from "./routes/index.route";
import staff from "./routes/staff/staff.index";
import projects from "./routes/projects/projects.index";
import images from "./routes/images/images.index";
import videos from "./routes/videos/videos.index";
import content from "./routes/content/content.index";

const app = createApp();

const routes = [index, staff, projects, images, videos, content];

configureOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
