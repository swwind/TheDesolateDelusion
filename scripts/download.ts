import { $, question } from "https://deno.land/x/zx_deno@1.2.2/mod.mjs";

import { Mod, Modpack } from "./types.ts";
import { request } from "./utils.ts";

export type DownloadTarget = "client" | "server";

const FILTER = {
  client: (mod: Mod) => mod.client,
  server: (mod: Mod) => mod.server,
};

export async function getInstalledMods() {
  await Deno.mkdir(".minecraft/mods", { recursive: true });
  return Array.from(Deno.readDirSync(".minecraft/mods"))
    .filter((file) => file.isFile)
    .map((file) => file.name);
}

export async function downloadMod(
  minecraft: string,
  mod: Mod,
  installedMods: string[]
) {
  console.log(`==> Checking updates for ${mod.name}...`);
  const files = await request<{
    data: {
      id: number;
      isAvailable: boolean;
      fileDate: string;
      fileName: string;
      downloadUrl: string | null;
      hashes: {
        algo: number;
        value: string;
      }[];
    }[];
  }>(`/v1/mods/${mod.id}/files?gameVersion=${minecraft}&modLoaderType=1`);
  const latest = mod.fileId
    ? files.data.find((file) => file.id === mod.fileId)
    : files.data
        .filter((file) => file.isAvailable)
        .sort(
          (a, b) =>
            new Date(a.fileDate).getTime() - new Date(b.fileDate).getTime()
        )
        .at(-1);

  if (!latest) {
    console.log(files.data);
    throw new Error(`No release found for ${mod.name}`);
  }

  const filename = `.minecraft/mods/${latest.fileName}`;
  if (!installedMods.includes(latest.fileName)) {
    console.log(`==> Downloading ${latest.fileName}...`);
    if (!latest.downloadUrl) throw new Error("Failed to get download URL");
    await $`wget -O ${filename} ${latest.downloadUrl}`;
  }

  console.log("==> Checking hashes...");
  for (const hash of latest.hashes) {
    const algo =
      hash.algo === 1 ? "sha1sum" : hash.algo === 2 ? "md5sum" : null;
    if (!algo) throw new Error(`Unknown checksum for algorithm ${hash.algo}`);
    await $`${algo} -c - <<< ${`${hash.value} ${filename}`}`;
  }

  return latest.fileName;
}

export async function downloadModpack(
  modpack: Modpack,
  target: DownloadTarget
) {
  const installed = await getInstalledMods();
  const checked = [];

  for (const mod of modpack.mods.filter(FILTER[target])) {
    try {
      checked.push(await downloadMod(modpack.minecraft, mod, installed));
    } catch (e) {
      console.error(e);
      const ignore = await question("Ignore ?", { choices: ["yes", "no"] });
      if (ignore) continue;
      else break;
    }
  }

  console.log(`==> Installed ${checked.length} mods`);
  for (const installedMod of installed) {
    if (!checked.includes(installedMod)) {
      console.log(`==> Removing ${installedMod}...`);
      await Deno.remove(`.minecraft/mods/${installedMod}`);
    }
  }
}
