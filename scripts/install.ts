import {
  checkHash,
  downloadModFile,
  getFileInfo,
  getInstalledMods,
  Modpack,
} from "./utils.ts";

const server = Deno.args.includes("--server");

const modpack = JSON.parse(await Deno.readTextFile("./mods.json")) as Modpack;

const installed = await getInstalledMods(
  server ? "server/mods" : ".minecraft/mods"
);
const checked = [];

for (const mod of modpack.mods.filter((mod) =>
  server ? mod.server : mod.client
)) {
  const fileinfo = await getFileInfo(mod.id, mod.fileId);
  const filename = server
    ? `server/mods/${fileinfo.data.fileName}`
    : `.minecraft/mods/${fileinfo.data.fileName}`;
  if (!installed.includes(fileinfo.data.fileName)) {
    if (!fileinfo.data.downloadUrl)
      throw new Error(`No release found for ${mod.name}`);
    await downloadModFile(fileinfo.data.downloadUrl, filename);
  }
  await checkHash(filename, fileinfo.data.hashes);
  checked.push(fileinfo.data.fileName);
}

console.log(`==> Installed ${checked.length} mods`);
for (const existed of installed) {
  if (!checked.includes(existed)) {
    console.log(`==> Removing ${existed}...`);
    await Deno.remove(
      server ? `server/mods/${existed}` : `.minecraft/mods/${existed}`
    );
  }
}
