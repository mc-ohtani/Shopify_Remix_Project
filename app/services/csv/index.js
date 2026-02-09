import { convert as freeeConvert } from "./freee/convert.js";
import { headers as freeeHeaders } from "./freee/headers.js";

import { convert as mfConvert } from "./moneyforward/convert.js";
import { headers as mfHeaders } from "./moneyforward/headers.js";

const registry = {
  freee: {
    headers: freeeHeaders,
    convert: freeeConvert,
  },
  moneyforward: {
    headers: mfHeaders,
    convert: mfConvert,
  },
};

export function getTargets() {
  return Object.keys(registry);
}

export function convertCsv(target, records) {
  const entry = registry[target];
  if (!entry) {
    throw new Error(`Unknown target: ${target}`);
  }

  return {
    headers: entry.headers,
    rows: entry.convert(records),
  };
}
