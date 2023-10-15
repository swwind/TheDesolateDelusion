import en from "./en_us.json" assert { type: "json" };
import zh from "./zh_cn.json" assert { type: "json" };

let x: Record<string, string> = { ...zh };

for (const [key, value] of Object.entries(en)) {
  x[key] = x[key] || `MISSING_TRANSLATE: ${value}`;
}

for (const key of Object.keys(zh)) {
  if (!(key in en)) {
    console.warn(`Warning: ${key} is deprecated`);
  }
}

console.log(JSON.stringify(x, null, 2));
