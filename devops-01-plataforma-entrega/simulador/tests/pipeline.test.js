import { test } from "node:test";
import assert from "node:assert/strict";
import { simular, STAGES, ESCENARIOS, UMBRAL, CHEQUEOS, duracion } from "../src/pipeline.js";

const fin = (ev) => ev.find((e) => e.tipo === "fin");
const estadoFinal = (ev, etapa) => ev.filter((e) => e.tipo === "etapa" && e.etapa === etapa).at(-1)?.estado;
const traficoFinal = (ev) => ev.filter((e) => e.tipo === "trafico").at(-1)?.canary ?? 0;

test("cambio correcto: todas las etapas en ok y 100 % del tráfico en la versión nueva", () => {
  const ev = simular("ok");
  assert.equal(fin(ev).resultado, "exito");
  for (const s of STAGES) assert.equal(estadoFinal(ev, s.id), "ok", s.id);
  assert.equal(traficoFinal(ev), 100);
});

test("el tráfico avanza en pasos 20 → 50 → 100", () => {
  const pasos = simular("ok").filter((e) => e.tipo === "trafico").map((e) => e.canary);
  assert.deepEqual(pasos, [20, 50, 100]);
});

test("error en producción: rollback en canary 20 % y el tráfico vuelve a 0", () => {
  const ev = simular("produccion");
  const f = fin(ev);
  assert.equal(f.resultado, "rollback");
  assert.equal(f.etapa, "canary20");
  assert.equal(f.expuestos, 20);
  assert.equal(traficoFinal(ev), 0);
  assert.equal(estadoFinal(ev, "canary50"), "omitida");
  assert.equal(estadoFinal(ev, "prod"), "omitida");
});

test("el rollback ocurre al superar el límite de chequeos fallidos (no al primero)", () => {
  const chequeos = simular("produccion").filter((e) => e.tipo === "chequeo");
  assert.equal(chequeos.filter((c) => !c.ok).length, 2);
});

test("prueba que falla: se bloquea en Pruebas y nada llega a producción", () => {
  const ev = simular("prueba");
  assert.equal(fin(ev).resultado, "bloqueado");
  assert.equal(estadoFinal(ev, "pruebas"), "falla");
  assert.equal(estadoFinal(ev, "imagen"), "omitida");
  assert.equal(ev.filter((e) => e.tipo === "trafico").length, 0);
});

test("configuración insegura: la bloquean las políticas", () => {
  const ev = simular("politica");
  assert.equal(fin(ev).etapa, "politicas");
  assert.equal(estadoFinal(ev, "pruebas"), "ok");
  assert.equal(estadoFinal(ev, "politicas"), "falla");
});

test("en un cambio correcto todas las métricas quedan dentro del umbral", () => {
  const chequeos = simular("ok").filter((e) => e.tipo === "chequeo");
  assert.equal(chequeos.length, CHEQUEOS * 2);
  assert.ok(chequeos.every((c) => c.ok && c.errores < UMBRAL.errores && c.latencia < UMBRAL.latencia));
});

test("la línea de tiempo está ordenada y la misma semilla da el mismo resultado", () => {
  for (const id of Object.keys(ESCENARIOS)) {
    const ev = simular(id, 42);
    assert.ok(ev.every((e, i) => i === 0 || e.t >= ev[i - 1].t), id);
    assert.deepEqual(simular(id, 42), ev);
  }
});

test("el rollback informa la duración real equivalente (2 chequeos × 30 s = 1 minuto)", () => {
  assert.equal(fin(simular("produccion")).duracionReal, "1 minuto");
});

test("textoDuracion redacta segundos y minutos", async () => {
  const { textoDuracion } = await import("../src/pipeline.js");
  assert.equal(textoDuracion(30), "30 segundos");
  assert.equal(textoDuracion(60), "1 minuto");
  assert.equal(textoDuracion(90), "1,5 minutos");
  assert.equal(textoDuracion(120), "2 minutos");
});

test("los escenarios bloqueados terminan antes que el despliegue completo", () => {
  const total = duracion(simular("ok"));
  assert.ok(duracion(simular("prueba")) < total);
  assert.ok(duracion(simular("produccion")) < total);
});
