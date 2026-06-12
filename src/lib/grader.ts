// Compares a user's query result to an expected result.
// Modes:
//   - "rows-exact": same rows, any order, column-name-insensitive
//   - "rows-ordered": same rows in the exact given order
//   - "single-value": result must be a single scalar matching expected
//   - "custom": validator fn

import type { QueryResult } from "./db";

export type GradeMode = "rows-exact" | "rows-ordered" | "single-value" | "custom";

export type GradeSpec =
  | { mode: "rows-exact"; expectedRows: Record<string, unknown>[]; columns?: string[] }
  | { mode: "rows-ordered"; expectedRows: Record<string, unknown>[]; columns?: string[] }
  | { mode: "single-value"; expected: unknown }
  | { mode: "custom"; check: (res: QueryResult) => { pass: boolean; message?: string } };

export type GradeResult = {
  pass: boolean;
  message: string;
  details?: string;
};

function normalize(v: unknown): unknown {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Math.abs(v) < 1e-9 ? 0 : Math.round(v * 1e6) / 1e6;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function rowKey(row: Record<string, unknown>, columns?: string[]): string {
  const keys = columns ?? Object.keys(row).sort();
  return keys.map((k) => normalize(row[k])).join("|");
}

export function grade(spec: GradeSpec, result: QueryResult | { ok: false; error: string }): GradeResult {
  if (!result.ok) {
    return { pass: false, message: "Query errored", details: result.error };
  }

  if (spec.mode === "single-value") {
    if (result.rows.length !== 1) {
      return { pass: false, message: `Expected 1 row, got ${result.rows.length}` };
    }
    const row = result.rows[0];
    const cols = Object.keys(row);
    if (cols.length !== 1) {
      return { pass: false, message: `Expected 1 column, got ${cols.length}` };
    }
    const got = normalize(row[cols[0]]);
    const want = normalize(spec.expected);
    if (got === want) return { pass: true, message: "Correct" };
    return { pass: false, message: "Wrong value", details: `expected ${want}, got ${got}` };
  }

  if (spec.mode === "custom") {
    const c = spec.check(result);
    return { pass: c.pass, message: c.pass ? "Correct" : c.message ?? "Failed custom check" };
  }

  const expected = spec.expectedRows;
  if (result.rows.length !== expected.length) {
    return {
      pass: false,
      message: `Expected ${expected.length} rows, got ${result.rows.length}`,
    };
  }

  if (spec.mode === "rows-ordered") {
    for (let i = 0; i < expected.length; i++) {
      const a = rowKey(result.rows[i], spec.columns);
      const b = rowKey(expected[i], spec.columns);
      if (a !== b) {
        return {
          pass: false,
          message: `Row ${i + 1} doesn't match`,
          details: `expected ${b}\ngot      ${a}`,
        };
      }
    }
    return { pass: true, message: "Correct" };
  }

  // rows-exact: bag comparison
  const expectedBag = new Map<string, number>();
  for (const r of expected) {
    const k = rowKey(r, spec.columns);
    expectedBag.set(k, (expectedBag.get(k) ?? 0) + 1);
  }
  for (const r of result.rows) {
    const k = rowKey(r, spec.columns);
    const c = expectedBag.get(k);
    if (!c) {
      return { pass: false, message: "Unexpected row in result", details: k };
    }
    expectedBag.set(k, c - 1);
  }
  for (const [, c] of expectedBag) {
    if (c !== 0) return { pass: false, message: "Some expected rows missing" };
  }
  return { pass: true, message: "Correct" };
}
