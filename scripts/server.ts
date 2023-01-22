import { $ } from "https://deno.land/x/zx_deno@1.2.2/mod.mjs";
import { checkHash, downloadModFile, getFileInfo, Modpack } from "./utils.ts";

await $`rm -rf server`;
await $`mkdir -p server`;

await $`if [ ! -f forge-1.19.2-43.2.3-installer.jar ]; then wget https://maven.minecraftforge.net/net/minecraftforge/forge/1.19.2-43.2.3/forge-1.19.2-43.2.3-installer.jar; fi`;
await $`java -jar forge-1.19.2-43.2.3-installer.jar --installServer server`;

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
await $`cp -r server.properties server`;
