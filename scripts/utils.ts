import "https://deno.land/std@0.152.0/dotenv/load.ts";
import { $ } from "https://deno.land/x/zx_deno@1.2.2/mod.mjs";

const BASE_URL = "https://api.curseforge.com";
const API_KEY = Deno.env.get("CURSEFORGE_API_KEY");

if (!API_KEY) {
  throw new Error("Missing CURSEFORGE_API_KEY in .env");
}

export type Mod = {
  id: number;
  name: string;
  client: boolean;
  server: boolean;
  fileId: number;
};

export type Modpack = {
  minecraft: string;
  mods: Mod[];
};

export async function request<T>(url: string) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      Accept: "application/json",
      "x-api-key": API_KEY!,
    },
  });
  return (await response.json()) as T;
}

export interface FileInfo {
  id: number;
  isAvailable: boolean;
  fileDate: string;
  fileName: string;
  downloadUrl: string | null;
  hashes: FileInfoHash[];
}

export interface FileInfoHash {
  algo: number;
  value: string;
}

export async function getFileInfo(modId: number, fileId: number) {
  return await request<{ data: FileInfo }>(`/v1/mods/${modId}/files/${fileId}`);
}

export async function getModFiles(minecraft: string, modId: number) {
  return await request<{ data: FileInfo[] }>(
    `/v1/mods/${modId}/files?gameVersion=${minecraft}&modLoaderType=1`
  );
}

export async function getInstalledMods(dirname: string) {
  await Deno.mkdir(dirname, { recursive: true });
  return Array.from(Deno.readDirSync(dirname))
    .filter((file) => file.isFile)
    .map((file) => file.name);
}

export async function downloadModFile(downloadUrl: string, filename: string) {
  console.log(`==> Downloading ${filename}...`);
  await $`wget -O ${filename} ${downloadUrl}`;
}

export async function checkHash(filename: string, hashes: FileInfoHash[]) {
  console.log(`==> Checking hashes for ${filename}...`);
  for (const hash of hashes) {
    const algo =
      hash.algo === 1 ? "sha1sum" : hash.algo === 2 ? "md5sum" : null;
    if (!algo) throw new Error(`Unknown checksum for algorithm ${hash.algo}`);
    await $`${algo} -c - <<< ${`${hash.value} ${filename}`}`;
  }
}
