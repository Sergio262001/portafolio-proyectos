import { test } from "node:test";
import assert from "node:assert/strict";
import { buildServer } from "../src/app.js";

async function withServer(fn, options) {
  const { server, state } = buildServer(options);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    await fn(`http://127.0.0.1:${port}`, state);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("healthz responde 200 con status ok", async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/healthz`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: "ok" });
  });
});

test("readyz responde 200 cuando el servicio está listo", async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/readyz`);
    assert.equal(res.status, 200);
  });
});

test("readyz responde 503 cuando el servicio se marca como no listo", async () => {
  await withServer(async (base, state) => {
    state.ready = false;
    const res = await fetch(`${base}/readyz`);
    assert.equal(res.status, 503);
  });
});

test("version expone versión y commit configurados", async () => {
  await withServer(
    async (base) => {
      const body = await (await fetch(`${base}/version`)).json();
      assert.equal(body.version, "1.2.3");
      assert.equal(body.commit, "abc123");
    },
    { version: "1.2.3", commit: "abc123" },
  );
});

test("ruta desconocida responde 404", async () => {
  await withServer(async (base) => {
    assert.equal((await fetch(`${base}/no-existe`)).status, 404);
  });
});

test("métodos distintos de GET responden 405", async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/healthz`, { method: "POST" });
    assert.equal(res.status, 405);
  });
});
