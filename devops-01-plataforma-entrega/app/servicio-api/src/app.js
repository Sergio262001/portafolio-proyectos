import { createServer } from "node:http";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

// Estado mutable para poder simular fallos en pruebas y en simulacros (game days).
export function createState({ version = "dev", commit = "local" } = {}) {
  return { ready: true, version, commit, startedAt: new Date().toISOString() };
}

export function createHandler(state) {
  return function handler(req, res) {
    const url = new URL(req.url ?? "/", "http://localhost");

    if (req.method !== "GET") {
      return send(res, 405, { error: "method_not_allowed" });
    }

    switch (url.pathname) {
      case "/":
        return send(res, 200, { service: "servicio-api", version: state.version });
      case "/healthz":
        // Liveness: el proceso responde.
        return send(res, 200, { status: "ok" });
      case "/readyz":
        // Readiness: el balanceador solo envía tráfico si esto responde 200.
        return state.ready
          ? send(res, 200, { status: "ready" })
          : send(res, 503, { status: "not_ready" });
      case "/version":
        return send(res, 200, {
          version: state.version,
          commit: state.commit,
          startedAt: state.startedAt,
        });
      default:
        return send(res, 404, { error: "not_found" });
    }
  };
}

function send(res, status, body) {
  res.writeHead(status, JSON_HEADERS);
  res.end(JSON.stringify(body));
}

export function buildServer(options = {}) {
  const state = createState(options);
  const server = createServer(createHandler(state));
  return { server, state };
}
