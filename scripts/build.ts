import { Modpack } from "./types.ts";
import { downloadModpack } from "./download.ts";

const modpack = JSON.parse(await Deno.readTextFile("./mods.json")) as Modpack;

await downloadModpack(
  modpack,
  Deno.args.includes("--server") ? "server" : "client"
);
