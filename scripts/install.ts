import {
  checkHash,
  downloadModFile,
  getFileInfo,
  getInstalledMods,
  Modpack,
} from "./utils.ts";

const modpack = JSON.parse(await Deno.readTextFile("./mods.json")) as Modpack;

const installed = await getInstalledMods();
const checked = [];

for (const mod of modpack.mods.filter((mod) => mod.client)) {
  const fileinfo = await getFileInfo(mod.id, mod.fileId);
  if (!installed.includes(fileinfo.data.fileName)) {
    if (!fileinfo.data.downloadUrl)
      throw new Error(`No release found for ${mod.name}`);
    await downloadModFile(fileinfo.data.downloadUrl, fileinfo.data.fileName);
  }
  await checkHash(fileinfo.data.fileName, fileinfo.data.hashes);
  checked.push(fileinfo.data.fileName);
}

console.log(`==> Installed ${checked.length} mods`);

for (const existed of installed) {
  if (!checked.includes(existed)) {
    console.log(`==> Removing ${existed}...`);
    await Deno.remove(`.minecraft/mods/${existed}`);
  }
}
