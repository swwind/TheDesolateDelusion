import "https://deno.land/std@0.152.0/dotenv/load.ts";

const BASE_URL = "https://api.curseforge.com";
const API_KEY = Deno.env.get("CURSEFORGE_API_KEY");

if (!API_KEY) {
  throw new Error("Missing CURSEFORGE_API_KEY in .env");
}

export async function request<T>(url: string) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      Accept: "application/json",
      "x-api-key": API_KEY!,
    },
  });
  return (await response.json()) as T;
}
