"use client";

import { IFile } from "@/app/page";
import { formatBytes } from "@/utils/number";
import { useEffect, useRef, useState } from "react";
import ImportFromIpfs from "./ImportFromIpfs";
import Spinner from "../Spinner";
import { truncateString } from "@/utils/string";
import Files from "./Files";

const PIN_STATUSES = ["Default", "Pinned", "Unpinned"];
const SORT_SIZE_OPTIONS = ["Default", "High-Low", "Low-High"];
const SORT_NAME_OPTIONS = ["Default", "A-Z", "Z-A"];
type SortQuery = {
  pinStatus: (typeof PIN_STATUSES)[number];
  size: (typeof SORT_SIZE_OPTIONS)[number];
  name: (typeof SORT_NAME_OPTIONS)[number];
};

export default function HomePageWrapper({ _files }: { _files: IFile[] }) {
  console.log({ _files });
  let timer: NodeJS.Timeout | null = null;
  const [files, setFiles] = useState<IFile[]>(_files);
  const [filteredFiles, setFilteredFiles] = useState<IFile[]>(_files);
  const [sortQuery, setSortQuery] = useState<SortQuery>({
    name: "A-Z",
    size: "Default",
    pinStatus: "Default",
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectNameRef = useRef<HTMLSelectElement>(null);
  const selectSizeRef = useRef<HTMLSelectElement>(null);
  const selectStatusRef = useRef<HTMLSelectElement>(null);
  // Pagination
  const [qtyPerPage, setQtyPerPage] = useState<number>(20);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const startIndex = (currentPageNum - 1) * qtyPerPage;
  const endIndex = startIndex + qtyPerPage;
  const currentPageItems: IFile[] = filteredFiles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredFiles.length / qtyPerPage);
  const pages = Array(totalPages)
    .fill(0)
    .map((_, index) => index + 1);
  const totalAmountPinned: string = files.length
    ? formatBytes(
        files
          .map((item) => item.CumulativeSize)
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          })
      )
    : "0";
  const searchItem = (keyword: string) => {
    if (!keyword) return setFilteredFiles(files);
    keyword = keyword.toLowerCase();
    const res = files.filter(
      (item) =>
        item.Path.toLowerCase().includes(keyword) ||
        item.Hash.toLowerCase().includes(keyword)
    );
    setFilteredFiles(res);
  };

  const [showHashPinToast, setShowHashPinToast] = useState<boolean>(false);
  const [pinningHash, setPinningHash] = useState<boolean>(false);
  const [toPinHash, setToPinHash] = useState<string>("");

  const importHashFromIpfs = async (hash: string, name: string) => {
    setToPinHash(hash);
    setPinningHash(true);
    setShowHashPinToast(true);
    // Pin to "/ipfs/<hash>"
    await fetch("/api/pin/add", {
      method: "POST",
      body: JSON.stringify({ hash }),
    });
    // cp /ipfs/<hash> to /<name>
    await fetch("/api/files/cp", {
      method: "POST",
      body: JSON.stringify({ originalPath: `ipfs/${hash}`, newPath: name }),
    });
    setPinningHash(false);
    setToPinHash("");
  };

  const PaginationContainer = () => {
    if (pages.length === 1) return <></>;
    return (
      <div className="flex flex-row mx-auto justify-center">
        {pages.map((item) => (
          <button
            key={item}
            onClick={() => setCurrentPageNum(item)}
            className={`border border-gray-400 mx-1 w-10 h-10 hover:border-white hover:border-2 duration-100 ${
              currentPageNum === item ? "bg-white text-black" : ""
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    );
  };

  useEffect(() => {
    console.log("useEffect: Updating sort");
    // If none is selected then reset to "A-Z"
    if (
      sortQuery.name === "Default" &&
      sortQuery.pinStatus === "Default" &&
      sortQuery.size === "Default"
    ) {
      sortQuery.name = "A-Z";
    }
    if (sortQuery.name !== "Default") {
      console.log("Sort by name: ", sortQuery.name);
      if (selectSizeRef.current) selectSizeRef.current.value = "Default";
      if (selectStatusRef.current) selectStatusRef.current.value = "Default";
      const newFiles = files.sort((a, b) =>
        sortQuery.name === "A-Z"
          ? a.Path.localeCompare(b.Path)
          : b.Path.localeCompare(a.Path)
      );
      setFiles([...newFiles]);
      //////////////
      //////////////
    } else if (sortQuery.size !== "Default") {
      if (selectNameRef.current) selectNameRef.current.value = "Default";
      if (selectStatusRef.current) selectStatusRef.current.value = "Default";
      const newFiles = files.sort((a, b) =>
        sortQuery.size === "High-Low"
          ? b.CumulativeSize - a.CumulativeSize
          : a.CumulativeSize - b.CumulativeSize
      );
      setFiles([...newFiles]);
      //////////////
      //////////////
    } else if (sortQuery.pinStatus !== "Default") {
      if (selectSizeRef.current) selectSizeRef.current.value = "Default";
      if (selectNameRef.current) selectNameRef.current.value = "Default";
      const pinnedArr: IFile[] = [];
      const unpinnedArr: IFile[] = [];
      files.forEach((item) => {
        if (item.isPinned) {
          pinnedArr.push(item);
        } else {
          unpinnedArr.push(item);
        }
      });
      const arr =
        sortQuery.pinStatus === "Pinned"
          ? pinnedArr.concat(unpinnedArr)
          : unpinnedArr.concat(pinnedArr);
      setFiles([...arr]);
    } else {
      console.log("Oops");
    }
  }, [sortQuery]);

  // Update after sort
  useEffect(() => {
    console.log("useEffect: Updating files");
    setFilteredFiles(files);
  }, [files]);

  const debounceSearch = (newValue: string) => {
    clearTimeout(timer as NodeJS.Timeout);
    timer = setTimeout(() => {
      searchItem(newValue);
    }, 400);
  };

  return (
    <>
      <div className="flex flex-col pb-32 pt-10">
        <div className="mx-auto mt-8">
          Total pinned: {totalAmountPinned}
          <br />
          Total recursive pins: {files.length}
        </div>
        <div className="relative mx-auto mt-4">
          <input
            type="text"
            ref={searchInputRef}
            onChange={(e) => debounceSearch(e.target.value)}
            placeholder="Search for name/cid"
            className="rounded-full border border-gray-400 py-2 px-4 w-[500px] bg-transparent"
          />
          <button
            onClick={() => {
              searchItem("");
              if (searchInputRef.current) searchInputRef.current.value = "";
            }}
            className="absolute h-7 w-7 right-2 top-0 bottom-0 my-auto rounded-full text-black bg-white"
          >
            X
          </button>
        </div>
        <div className="flex flex-col w-full max-w-[90vw] lg:max-w-[900px] mx-auto">
          <div className="flex flex-row my-8 justify-center">
            {/* Name */}
            <div className="flex flex-row w-fit mr-4 border hover:border-white border-transparent pl-2">
              <div>Name&nbsp;</div>
              <select
                ref={selectNameRef}
                className="w-fit pl-1 cursor-pointer"
                onChange={(e) =>
                  setSortQuery({
                    size: "Default",
                    name: e.target.value,
                    pinStatus: "Default",
                  })
                }
              >
                {SORT_NAME_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {/* Size */}
            <div className="flex flex-row w-fit mr-4 border hover:border-white border-transparent pl-2">
              <div>Size&nbsp;</div>
              <select
                ref={selectSizeRef}
                className="w-fit pl-1 cursor-pointer"
                onChange={(e) =>
                  setSortQuery({
                    size: e.target.value,
                    name: "Default",
                    pinStatus: "Default",
                  })
                }
              >
                {SORT_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {/* Pin status */}
            <div className="flex flex-row w-fit mr-4 border hover:border-white border-transparent pl-2">
              <div>Status&nbsp;</div>
              <select
                ref={selectStatusRef}
                className="w-fit pl-1 cursor-pointer"
                onChange={(e) =>
                  setSortQuery({
                    size: "Default",
                    name: "Default",
                    pinStatus: e.target.value,
                  })
                }
              >
                {PIN_STATUSES.map((stt) => (
                  <option key={stt} value={stt}>
                    {stt}
                  </option>
                ))}
              </select>
            </div>
            {/* No. per page */}
            <div className="flex flex-row w-fit mr-4 border hover:border-white border-transparent pl-2">
              <div>Qty/page&nbsp;</div>
              <select
                className="w-fit pl-1 cursor-pointer"
                onChange={(e) => setQtyPerPage(parseInt(e.target.value))}
              >
                {[20, 40, 60, 80, 100, 200, 300].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <PaginationContainer />
        </div>
        {/* Files */}
        <Files files={currentPageItems} setChange={setFiles} />
        <PaginationContainer />
      </div>

      <ImportFromIpfs files={files} saveFn={importHashFromIpfs} />
      {showHashPinToast && (
        <div className="toast toast-end">
          {/* <div className="alert alert-info">
          <div>
            <span>New mail arrived.</span>
          </div>
        </div> */}

          <div className="alert alert-success">
            {pinningHash ? (
              <Spinner size={30} />
            ) : (
              <button onClick={() => setShowHashPinToast(false)}>
                <svg height="30" viewBox="0 0 48 48" width="30">
                  <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z" />
                  <path d="M0 0h48v48h-48z" fill="none" />
                </svg>
              </button>
            )}
            <div>
              {pinningHash ? (
                <span>Pinning: {truncateString(toPinHash)}</span>
              ) : (
                <span>Pinned succesfully</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
