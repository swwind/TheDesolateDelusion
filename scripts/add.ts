import { Modpack } from "./types.ts";
import { request } from "./utils.ts";

const modpack = JSON.parse(await Deno.readTextFile("./mods.json")) as Modpack;

const client = Deno.args.includes("--client") || Deno.args.includes("--all");
const server = Deno.args.includes("--server") || Deno.args.includes("--all");

if (!client && !server) {
  throw new Error("Missing --client or --server flag");
}

const modId = Deno.args.find((value) => /^\d+$/.test(value));

if (!modId) {
  throw new Error("Missing mod id");
}

const id = Number(modId);

if (modpack.mods.find((mod) => mod.id === id)) {
  throw new Error("Mod already exists");
}

const json = await request(`/v1/mods/${id}`);

modpack.mods.push({
  id,
  name: json.data.name,
  client,
  server,
});

console.log(`Added ${json.data.name}`);

await Deno.writeTextFile("./mods.json", JSON.stringify(modpack, null, 2));
