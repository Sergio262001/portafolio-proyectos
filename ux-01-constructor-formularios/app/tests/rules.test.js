import { test } from "node:test";
import assert from "node:assert/strict";
import {
  newField, isVisible, visibleIds, detectCycles, validate,
  insertField, moveField, removeField, History,
} from "../src/rules.js";

const tipo = { ...newField("select", "tipo"), label: "Tipo", options: ["Consulta", "Reclamo"], required: true };
const pedido = {
  ...newField("number", "pedido"), label: "Pedido", min: 1, max: 999,
  rule: { fieldId: "tipo", op: "equals", value: "Reclamo" },
};
const detalle = {
  ...newField("text", "detalle"), label: "Detalle", required: true, minLength: 5,
  rule: { fieldId: "pedido", op: "filled" },
};
const fields = [tipo, pedido, detalle];

test("un campo con regla se oculta si la regla no se cumple", () => {
  assert.equal(isVisible(pedido, fields, { tipo: "Consulta" }), false);
  assert.equal(isVisible(pedido, fields, { tipo: "Reclamo" }), true);
});

test("la visibilidad se encadena: si el origen está oculto, el dependiente también", () => {
  const values = { tipo: "Consulta", pedido: 10 }; // pedido tiene valor pero está oculto
  assert.equal(visibleIds(fields, values).has("detalle"), false);
  assert.equal(visibleIds(fields, { tipo: "Reclamo", pedido: 10 }).has("detalle"), true);
});

test("detectCycles encuentra ciclos y autorreferencias", () => {
  const a = { ...newField("text", "a"), rule: { fieldId: "b", op: "filled" } };
  const b = { ...newField("text", "b"), rule: { fieldId: "a", op: "filled" } };
  const c = { ...newField("text", "c"), rule: { fieldId: "c", op: "filled" } };
  const d = newField("text", "d");
  assert.deepEqual(detectCycles([a, b, d]).sort(), ["a", "b"]);
  assert.deepEqual(detectCycles([c]), ["c"]);
  assert.deepEqual(detectCycles(fields), []);
});

test("un ciclo no provoca bucle infinito al evaluar visibilidad", () => {
  const a = { ...newField("text", "a"), rule: { fieldId: "b", op: "filled" } };
  const b = { ...newField("text", "b"), rule: { fieldId: "a", op: "filled" } };
  assert.doesNotThrow(() => visibleIds([a, b], {}));
});

test("validate ignora campos ocultos y exige los visibles", () => {
  assert.deepEqual(validate(fields, { tipo: "Consulta" }), {});
  assert.deepEqual(Object.keys(validate(fields, {})), ["tipo"]);
});

test("validate aplica mínimo, máximo y longitud mínima", () => {
  const base = { tipo: "Reclamo" };
  assert.match(validate(fields, { ...base, pedido: 0 }).pedido, /mínimo/);
  assert.match(validate(fields, { ...base, pedido: 1000 }).pedido, /máximo/);
  assert.match(validate(fields, { ...base, pedido: 5, detalle: "abc" }).detalle, /al menos 5/);
  assert.deepEqual(validate(fields, { ...base, pedido: 5, detalle: "suficiente" }), {});
});

test("una casilla obligatoria sin marcar da error", () => {
  const terms = { ...newField("checkbox", "t"), required: true };
  assert.match(validate([terms], { t: false }).t, /marcar/);
  assert.deepEqual(validate([terms], { t: true }), {});
});

test("insertField y moveField no mutan la lista original", () => {
  const a = newField("text", "a"), b = newField("text", "b"), c = newField("text", "c");
  const original = [a, b];
  const inserted = insertField(original, c, 0);
  assert.deepEqual(inserted.map((f) => f.id), ["c", "a", "b"]);
  assert.deepEqual(original.map((f) => f.id), ["a", "b"]);
  assert.deepEqual(moveField(inserted, "c", 2).map((f) => f.id), ["a", "b", "c"]);
});

test("removeField quita las reglas que dependían del campo borrado", () => {
  const result = removeField(fields, "tipo");
  assert.equal(result.find((f) => f.id === "pedido").rule, null);
  assert.equal(result.length, 2);
});

test("History permite deshacer y rehacer, y rehacer se pierde al editar", () => {
  const h = new History([1]);
  h.push([1, 2]);
  h.push([1, 2, 3]);
  assert.deepEqual(h.undo(), [1, 2]);
  assert.deepEqual(h.undo(), [1]);
  assert.equal(h.canUndo, false);
  assert.deepEqual(h.redo(), [1, 2]);
  h.push([9]);
  assert.equal(h.canRedo, false);
});
