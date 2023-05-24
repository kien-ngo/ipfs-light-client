import { IFile } from "@/app/page";
import { Fragment, memo, useState } from "react";
import ChangePathNameModal from "./ChangePathNameModal";
import { truncateString } from "@/utils/string";
import { PRIVATE_GATEWAY } from "@/const";

const Files = ({
  files,
  setChange,
}: {
  files: IFile[];
  setChange: Function;
}) => {
  const [toEditIndex, setToEditIndex] = useState<number>(-1);
  const [toggledHash, setToggledHash] = useState<string>("");
  const toEditPathName = files[toEditIndex]?.Path ?? "";
  const [showHashCopyToast, setShowHashCopyToast] = useState<boolean>(false);

  const savePathName = async (newName: string) => {
    files[toEditIndex].Path = newName;
    setChange([...files]);
    // Update the MFS
    await fetch("/api/files/cp", {
      method: "POST",
      body: JSON.stringify({
        originalPath: toEditPathName,
        newPath: newName,
      }),
    }),
      await fetch("/api/files/rm", {
        method: "POST",
        body: JSON.stringify({
          path: toEditPathName,
          isDirectory: files[toEditIndex].Type === "directory",
        }),
      }),
      setToEditIndex(-1);
  };

  const cancelNameEdit = () => {
    setToEditIndex(-1);
  };

  const copyHash = (hash: string) => {
    window.navigator.clipboard.writeText(hash);
    setShowHashCopyToast(true);
    setTimeout(() => setShowHashCopyToast(false), 2000);
  };

  const exportToCar = async (
    fileName: string,
    downloadPath: string,
    cid: string
  ) => {
    alert("??/");
    await fetch("/api/dag/export", {
      method: "POST",
      body: JSON.stringify({ fileName, downloadPath, cid }),
    });
  };

  return (
    <>
      <div className="mx-auto flex flex-col mt-4 w-full max-w-[90vw] lg:max-w-[900px]">
        {files.map((file, index) => {
          return (
            <Fragment key={file.Path}>
              <div
                className={`hover:border-white hover:border-2 duration-100 flex flex-row border border-gray-400 rounded-t-lg px-3 py-2 h-20 cursor-pointer ${
                  toggledHash === file.Hash ? "mb-0" : "mb-3 rounded-b-lg"
                }`}
              >
                <input type="checkbox" className="" />
                <div className="flex flex-col ml-6 lg:w-[500px] md:w-[500px] my-auto mr-auto">
                  <div className="text-lg font-bold">
                    <label
                      htmlFor="ChangePathNameModal"
                      className="cursor-pointer flex flex-row w-fit hover:text-warning"
                      onClick={() => setToEditIndex(index)}
                      title={file.Path}
                    >
                      {truncateString(file.Path, 50)}{" "}
                      <svg
                        viewBox="0 0 24 24"
                        width={17}
                        height={17}
                        className="my-auto ml-1"
                      >
                        <path
                          d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1Zm-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83-6.94 6.93a1 1 0 0 0-.29.71Zm10.76-8.35 2.83 2.83-1.42 1.42-2.83-2.83ZM8 13.17l5.93-5.93 2.83 2.83L10.83 16H8Z"
                          fill="#ffffff"
                        ></path>
                      </svg>
                    </label>
                  </div>

                  <button
                    className="flex flex-row hover:text-warning w-fit"
                    onClick={() => copyHash(file.Hash)}
                  >
                    <div className="text-sm " title={file.Hash}>
                      {truncateString(file.Hash)}
                    </div>
                    <svg
                      viewBox="0 0 48 48"
                      width={18}
                      height={18}
                      className="ml-2"
                    >
                      <path d="M0 0h48v48H0z" fill="none"></path>
                      <path
                        d="M32 2H8C5.79 2 4 3.79 4 6v28h4V6h24V2zm6 8H16c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h22c2.21 0 4-1.79 4-4V14c0-2.21-1.79-4-4-4zm0 32H16V14h22v28z"
                        fill="#ffffff"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col w-[100px] my-auto">
                  <div className="mx-auto">
                    <button
                      className={`${
                        file.isPinned ? "bg-green-600" : "bg-red-500"
                      } w-fit px-3 py-1 rounded-full text-xs`}
                    >
                      {file.isPinned ? "Pinned" : "Unpinned"}
                    </button>
                  </div>
                  <div className="mx-auto mt-1">{file.displaySize}</div>
                </div>
                <div className="my-auto ml-4">
                  {toggledHash === file.Hash ? (
                    <svg
                      viewBox="0 0 48 48"
                      width={32}
                      height={32}
                      onClick={() => setToggledHash("")}
                    >
                      <path
                        d="M38 12.83 35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z"
                        fill="#ffffff"
                      ></path>
                      <path d="M0 0h48v48H0z" fill="none"></path>
                    </svg>
                  ) : (
                    <svg
                      onClick={() => setToggledHash(file.Hash)}
                      viewBox="0 0 32 32"
                      enableBackground="new 0 0 32 32"
                      width={32}
                      height={32}
                    >
                      <path
                        d="M4 10h24a2 2 0 0 0 0-4H4a2 2 0 0 0 0 4zm24 4H4a2 2 0 0 0 0 4h24a2 2 0 0 0 0-4zm0 8H4a2 2 0 0 0 0 4h24a2 2 0 0 0 0-4z"
                        fill="#ffffff"
                      ></path>
                    </svg>
                  )}
                </div>
              </div>
              {toggledHash === file.Hash && (
                <div className="bg-gray-700 flex flex-row justify-evenly border border-gray-400 mb-3 rounded-b-lg px-3 py-2 h-14 cursor-pointer w-[99%] mx-auto">
                  {file.isPinned ? (
                    <button className="hover:underline text-red-500 select-none">
                      Remove pin
                    </button>
                  ) : (
                    <button className="select-none">Set pin</button>
                  )}
                  <button
                    className="select-none"
                    onClick={() => exportToCar("test.car", ".", file.Hash)}
                  >
                    Export to .CAR
                  </button>
                  <a
                    className="select-none my-auto"
                    href={`${PRIVATE_GATEWAY}/${file.Hash}`}
                  >
                    View {file.Type === "directory" ? "folder" : "file"}
                  </a>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
      <ChangePathNameModal
        defaultValue={toEditPathName}
        saveFn={savePathName}
        closeFn={cancelNameEdit}
      />
      {showHashCopyToast && (
        <div className="toast toast-top mt-10">
          <div className="alert alert-success">
            <div>
              <span>Hash copied.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Files);
