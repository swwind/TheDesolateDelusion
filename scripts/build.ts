import { $, cd } from "https://deno.land/x/zx_deno@1.2.2/mod.mjs";
import { FORGE_VERSION, Modpack, MODPACK_VERSION } from "./utils.ts";

const cwd = Deno.cwd();

await $`rm -rf build`;
await $`mkdir -p build`;
await $`mkdir -p build/overrides`;
await $`mkdir -p release`;

await $`cp -r .minecraft/config build/overrides`;
await $`cp -r .minecraft/defaultconfigs build/overrides`;
await $`cp -r .minecraft/kubejs build/overrides`;

await $`rm -rf build/overrides/kubejs/exported`;

cd(`${cwd}/build/overrides/config/openloader/data/TheDesolateDelusion`);
await $`zip -r TheDesolateDelusion.zip data pack.mcmeta`;
await $`mv TheDesolateDelusion.zip ..`;
await $`cd .. && rm -rf TheDesolateDelusion`;

cd(`${cwd}/build/overrides/config/openloader/resources/TheDesolateDelusion`);
await $`zip -r TheDesolateDelusion.zip assets pack.mcmeta`;
await $`mv TheDesolateDelusion.zip ..`;
await $`cd .. && rm -rf TheDesolateDelusion`;

const mods = JSON.parse(await Deno.readTextFile("mods.json")) as Modpack;

const manifest = {
  minecraft: {
    version: mods.minecraft,
    modLoaders: [
      {
        id: `forge-${FORGE_VERSION}`,
        primary: true,
      },
    ],
  },
  manifestType: "minecraftModpack",
  manifestVersion: 1,
  name: "The Desolate Delusion",
  version: MODPACK_VERSION,
  author: "swwind",
  overrides: "overrides",
  files: mods.mods
    .filter((mod) => mod.client)
    .map((mod) => ({
      projectID: mod.id,
      fileID: mod.fileId,
      required: true,
    })),
};

await Deno.writeTextFile(
  `${cwd}/build/manifest.json`,
  JSON.stringify(manifest, null, 2)
);
cd(`${cwd}/build`);
await $`zip -r modpack.zip overrides manifest.json`;
await $`mv modpack.zip ${`../release/The_Desolate_Delusion-${MODPACK_VERSION}.zip`}`;
