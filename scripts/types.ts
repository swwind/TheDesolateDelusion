export type Mod = {
  id: number;
  name: string;
  client: boolean;
  server: boolean;
  fileId?: number;
};

export type Modpack = {
  minecraft: string;
  mods: Mod[];
};
