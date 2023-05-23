import { BASE_URL } from "@/const";
// Example
// {"Name":"0-99 URI","Type":0,"Size":0,"Hash":""}
export type FilePath = {
  Name: string;
  Type: number;
  Size: number;
  Hash: string;
};

// Example
// {
//   "Hash":"QmPK42mHojJCUAe21rHiQscEWfxCspbrvo7941xuWT1hmR",
//   "Size":0,
//   "CumulativeSize":950499619,
//   "Blocks":4000,
//   "Type":"directory"
// }
interface IStat {
  Hash: string;
  Size: number;
  CumulativeSize: number;
  Blocks: number;
  Type: "directory" | "file";
}

export interface IFileStat extends IStat {
  Path: string;
}

// Example
// {
//   "Name":"Label of this pin",
//   "Type":0,
//   "Size":0,
//   "Hash":""
// }
export type PinType = "recursive" | "all" | "direct" | "indirect";

export type PinObj = {
  Keys: {
    [key in string]: {
      type: PinType;
    };
  };
};

export async function fetchFileStat(path: string): Promise<IFileStat> {
  const res = await fetch(`${BASE_URL}/files/stat?arg=/${encodeURI(path)}`, {
    method: "POST",
  });
  const data: IStat = await res.json();
  const fileStat: IFileStat = Object.assign(data, { Path: path });
  return fileStat;
}

export async function fetchFilePaths(): Promise<FilePath[]> {
  const res = await fetch(`${BASE_URL}/files/ls`, {
    method: "POST",
  });
  const data: { Entries: FilePath[] } = await res.json();
  const files: FilePath[] = data.Entries ?? [];
  return files;
}
export async function fetchPins(type: PinType = "recursive"): Promise<PinObj> {
  const res = await fetch(
    `${BASE_URL}/pin/ls?type=${type ? type : "recursive"}`,
    {
      method: "POST",
    }
  );
  const data: PinObj = await res.json();
  return data;
}
