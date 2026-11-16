import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULTS, PARAMS, clampParams, simulate, summarize, bestIndexes, niceScale } from "../src/model.js";

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);

test("simula tantos meses como el horizonte", () => {
  assert.equal(simulate({ ...DEFAULTS, meses: 12 }).length, 12);
});

test("el crecimiento es compuesto desde el mes 2", () => {
  const rows = simulate({ ...DEFAULTS, inicial: 100, crecimiento: 10, capacidad: 50000, meses: 3 });
  close(rows[0].unidades, 100);
  close(rows[1].unidades, 110);
  close(rows[2].unidades, 121);
});

test("las unidades nunca superan la capacidad", () => {
  const rows = simulate({ ...DEFAULTS, inicial: 100, crecimiento: 50, capacidad: 350, meses: 12 });
  assert.ok(rows.every((r) => r.unidades <= 350));
  assert.equal(rows[rows.length - 1].unidades, 350);
});

test("si la capacidad es menor que las unidades iniciales, parte del tope", () => {
  assert.equal(simulate({ ...DEFAULTS, inicial: 500, capacidad: 200 })[0].unidades, 200);
});

test("el acumulado es la suma de los netos", () => {
  const rows = simulate(DEFAULTS);
  close(rows[rows.length - 1].acumulado, rows.reduce((s, r) => s + r.neto, 0), 1e-6);
});

test("summarize encuentra el mes de equilibrio y el de capacidad", () => {
  const params = { inicial: 10, crecimiento: 50, margen: 100, costoFijo: 2000, capacidad: 10000, meses: 12 };
  // neto por mes: 1000-2000, 1500-2000, 2250-2000 → equilibrio en el mes 3
  assert.equal(summarize(simulate(params), params).mesEquilibrio, 3);

  const cap = { ...DEFAULTS, inicial: 100, crecimiento: 50, capacidad: 350, meses: 12 };
  assert.equal(summarize(simulate(cap), cap).mesCapacidad, 5); // 100, 150, 225, 337.5 (aún bajo), 350 (tope)
});

test("sin equilibrio ni capacidad dentro del horizonte devuelve null", () => {
  const p = { inicial: 1, crecimiento: 0, margen: 1, costoFijo: 100000, capacidad: 50000, meses: 6 };
  const s = summarize(simulate(p), p);
  assert.equal(s.mesEquilibrio, null);
  assert.equal(s.mesCapacidad, null);
});

test("clampParams corrige valores fuera de rango o inválidos", () => {
  const c = clampParams({ inicial: -5, crecimiento: 999, margen: "abc", meses: 2.6 });
  assert.equal(c.inicial, PARAMS.inicial.min);
  assert.equal(c.crecimiento, PARAMS.crecimiento.max);
  assert.equal(c.margen, DEFAULTS.margen);
  assert.equal(c.meses, 3);
});

test("bestIndexes elige el mejor escenario y marca empates como null", () => {
  const best = bestIndexes([
    { acumuladoFinal: 100, unidadesFinal: 50, mesEquilibrio: 5 },
    { acumuladoFinal: 300, unidadesFinal: 50, mesEquilibrio: null },
    { acumuladoFinal: 200, unidadesFinal: 50, mesEquilibrio: 2 },
  ]);
  assert.equal(best.acumuladoFinal, 1);
  assert.equal(best.mesEquilibrio, 2);
  assert.equal(best.unidadesFinal, null); // empate total: no se destaca ninguno
});

test("niceScale produce marcas ordenadas que cubren el rango", () => {
  const s = niceScale(-1234, 56789);
  assert.ok(s.min <= -1234 && s.max >= 56789);
  assert.deepEqual([...s.ticks].sort((a, b) => a - b), s.ticks);
  assert.ok(s.ticks.length >= 3 && s.ticks.length <= 12);
  assert.doesNotThrow(() => niceScale(5, 5));
});
