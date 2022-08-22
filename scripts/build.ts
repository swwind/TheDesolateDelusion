import { $, cd } from "https://deno.land/x/zx_deno@1.2.2/mod.mjs";
import { Modpack } from "./utils.ts";

await $`rm -rf build`;
await $`mkdir -p build`;
await $`mkdir -p build/overrides`;
await $`mkdir -p release`;

await $`cp -r .minecraft/config build/overrides`;
await $`cp -r .minecraft/defaultconfigs build/overrides`;
await $`cp -r .minecraft/kubejs build/overrides`;
await $`cp .minecraft/options.txt build/overrides`;
await $`cp .minecraft/rhino.local.properties build/overrides`;

const mods = JSON.parse(await Deno.readTextFile("mods.json")) as Modpack;

const manifest = {
  minecraft: {
    version: mods.minecraft,
    modLoaders: [
      {
        id: "forge-40.1.73",
        primary: true,
      },
    ],
  },
  manifestType: "minecraftModpack",
  manifestVersion: 1,
  name: "The Desolate Delusion",
  version: "0.0.1",
  author: "swwind",
  overrides: "overrides",
  files: mods.mods
    .filter((mod) => mod.client)
    .map((mod) => ({
      projectId: mod.id,
      fileId: mod.fileId,
      required: true,
    })),
};

await Deno.writeTextFile(
  "build/manifest.json",
  JSON.stringify(manifest, null, 2)
);

cd("build");

await $`zip -r modpack.zip overrides manifest.json`;
await $`mv modpack.zip ../release/The_Desolate_Delusion-0.0.1.zip`;
