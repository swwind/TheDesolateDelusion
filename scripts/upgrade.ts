import { getModFiles, Modpack } from "./utils.ts";

const modpack = JSON.parse(await Deno.readTextFile("./mods.json")) as Modpack;
const summary: string[] = [];

for (const mod of modpack.mods.filter((mod) => mod.client)) {
  console.log(`==> Checking updates for ${mod.name}...`);
  const files = await getModFiles(modpack.minecraft, mod.id);
  const latest = files.data
    .filter((file) => file.isAvailable)
    .sort(
      (a, b) => new Date(a.fileDate).getTime() - new Date(b.fileDate).getTime()
    )
    .at(-1);

  files.data.map((file) => console.log(`${file.fileName}: ${file.fileDate}`));

  if (!latest) {
    throw new Error(`No release found for ${mod.name}`);
  }

  if (mod.fileId === latest.id) {
    continue;
  }

  mod.fileId = latest.id;
  summary.push(`${mod.name}: ${latest.fileName}`);
}

await Deno.writeTextFile("./mods.json", JSON.stringify(modpack, null, 2));
summary.map((info) => console.log(info));
