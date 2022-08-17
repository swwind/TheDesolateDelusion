import { checkHash, downloadModFile, getModFiles, Modpack } from "./utils.ts";

const modpack = JSON.parse(await Deno.readTextFile("./mods.json")) as Modpack;
let updated = 0;

for (const mod of modpack.mods) {
  console.log(`==> Checking updates for ${mod.name}...`);
  const files = await getModFiles(modpack.minecraft, mod.id);
  const latest = files.data
    .filter((file) => file.isAvailable)
    .sort(
      (a, b) => new Date(a.fileDate).getTime() - new Date(b.fileDate).getTime()
    )
    .at(-1);

  if (!latest) {
    throw new Error(`No release found for ${mod.name}`);
  }

  if (mod.fileId === latest.id) {
    continue;
  }

  console.log(`==> Updating ${mod.name}...`);
  if (!latest.downloadUrl) throw new Error("Failed to get download URL");
  await downloadModFile(latest.downloadUrl, latest.fileName);
  await checkHash(latest.fileName, latest.hashes);

  mod.fileId = latest.id;
  updated = updated + 1;
}

console.log(`==> Updated ${updated} mods`);
await Deno.writeTextFile("./mods.json", JSON.stringify(modpack, null, 2));
