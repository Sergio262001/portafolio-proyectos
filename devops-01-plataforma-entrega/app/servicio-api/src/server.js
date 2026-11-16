import { buildServer } from "./app.js";

const port = Number(process.env.PORT ?? 8080);
const { server, state } = buildServer({
  version: process.env.APP_VERSION ?? "dev",
  commit: process.env.GIT_COMMIT ?? "local",
});

server.listen(port, () => {
  console.log(JSON.stringify({ level: "info", msg: "servidor iniciado", port, version: state.version }));
});

// Apagado ordenado: Kubernetes envía SIGTERM antes de terminar el pod.
function shutdown(signal) {
  console.log(JSON.stringify({ level: "info", msg: "apagando", signal }));
  state.ready = false;
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
