import { $ } from "https://deno.land/x/zx_deno@1.2.2/mod.mjs";

await $`rm -rf server`;
await $`mkdir -p server`;

await $`if [ ! -f forge-1.18.2-40.1.73-installer.jar ]; then wget https://maven.minecraftforge.net/net/minecraftforge/forge/1.18.2-40.1.73/forge-1.18.2-40.1.73-installer.jar; fi`;
await $`java -jar forge-1.18.2-40.1.73-installer.jar --installServer server`;

await $`mkdir -p server/mods`;
await $`cp -r .minecraft/config server`;
await $`cp -r .minecraft/defaultconfigs server`;
await $`cp -r .minecraft/kubejs server`;
await $`cp -r .minecraft/rhino.local.properties server`;
await $`cp -r server.properties server`;
