import {
  checkHash,
  downloadModFile,
  getModFiles,
  Modpack,
  request,
} from "./utils.ts";

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

const json = await request<{ data: { name: string } }>(`/v1/mods/${id}`);
const name = json.data.name;

console.log(`==> Installing ${name}...`);

const files = await getModFiles(modpack.minecraft, id);
const latest = files.data
  .filter((file) => file.isAvailable)
  .sort(
    (a, b) => new Date(a.fileDate).getTime() - new Date(b.fileDate).getTime()
  )
  .at(-1);

if (!latest || !latest.downloadUrl) {
  throw new Error(`No release found for ${name}`);
}

const filename = `.minecraft/mods/${latest.fileName}`;
await downloadModFile(latest.downloadUrl, filename);
await checkHash(filename, latest.hashes);

modpack.mods.push({ id, name, client, server, fileId: latest.id });
await Deno.writeTextFile("./mods.json", JSON.stringify(modpack, null, 2));
