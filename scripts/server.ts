import { $ } from "https://deno.land/x/zx_deno@1.2.2/mod.mjs";
import {
  checkHash,
  downloadModFile,
  getFileInfo,
  Modpack,
  MINECRAFT_VERSION,
  FORGE_VERSION,
} from "./utils.ts";

await $`rm -rf server`;
await $`mkdir -p server`;

const INSTALLER_NAME = `forge-${MINECRAFT_VERSION}-${FORGE_VERSION}-installer.jar`;
const INSTALLER_URL = `https://maven.minecraftforge.net/net/minecraftforge/forge/${MINECRAFT_VERSION}-${FORGE_VERSION}/${INSTALLER_NAME}`;

await $`if [ ! -f ${INSTALLER_NAME} ]; then wget ${INSTALLER_URL}; fi`;
await $`java -jar ${INSTALLER_NAME} --installServer server`;

await $`mkdir -p server/mods`;

const modpack = JSON.parse(await Deno.readTextFile("./mods.json")) as Modpack;

for (const mod of modpack.mods.filter((mod) => mod.server)) {
  const fileinfo = await getFileInfo(mod.id, mod.fileId);
  const filename = `server/mods/${fileinfo.data.fileName}`;
  if (!fileinfo.data.downloadUrl)
    throw new Error(`No release found for ${mod.name}`);
  await downloadModFile(fileinfo.data.downloadUrl, filename);
  await checkHash(filename, fileinfo.data.hashes);
}

await $`cp -r .minecraft/config server`;
await $`cp -r .minecraft/defaultconfigs server`;
await $`cp -r .minecraft/kubejs server`;
