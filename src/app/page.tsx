import HomePageWrapper from "@/components/home-page/HomePageWrapper";
import ScrollTopButton from "@/components/home-page/ScrollTopButton";
import {
  FilePath,
  IFileStat,
  fetchFilePaths,
  fetchFileStat,
  fetchPins,
} from "@/utils/api";
import { formatBytes } from "@/utils/number";

export interface IFile extends IFileStat {
  isPinned: boolean;
  displaySize: string;
}
export default async function Home() {
  const [filePaths, pinLs] = await Promise.all([fetchFilePaths(), fetchPins()]);
  const requests: Promise<any>[] = filePaths.map((file: FilePath) =>
    fetchFileStat(file.Name)
  );
  const res: IFileStat[] = await Promise.all(requests);
  const files: IFile[] = res.map((item) => {
    const isPinned = pinLs.Keys.hasOwnProperty(item.Hash);
    const obj: IFile = {
      isPinned: isPinned,
      Hash: item.Hash,
      Size: item.Size,
      CumulativeSize: item.CumulativeSize,
      Blocks: item.Blocks,
      Type: item.Type,
      Path: item.Path,
      displaySize: formatBytes(item.CumulativeSize),
    };
    return obj;
  });
  return (
    <>
      <HomePageWrapper _files={files} />
      <ScrollTopButton />
    </>
  );
}
