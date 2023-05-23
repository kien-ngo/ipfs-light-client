import { useRef } from "react";
import { validateIpfsHash } from "../../utils/string";
import { closePopup } from "../../utils/modal";
import { IFile } from "@/app/page";

type Props = {
  files: IFile[];
  saveFn: Function;
};

export default function ImportFromIpfs(props: Props) {
  const { files, saveFn } = props;
  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputHashRef = useRef<HTMLInputElement>(null);

  const saveNewHash = () => {
    const hash = inputHashRef.current?.value ?? "";
    if (!hash) return alert("Missing hash");
    const name = inputNameRef.current?.value ?? hash;
    const isNameValid =
      !name || (name && !files.find((item) => item.Path === name));
    const isHashValid = !hash || (hash && validateIpfsHash(hash));
    if (!isNameValid) return alert("This name already exists");
    if (!isHashValid) return alert("Invalid Hash");
    if (files.find((item) => item.Hash === hash)?.isPinned)
      return alert("This hash is already pinned");
    saveFn(hash, name);
    closePopup("ImportFromIpfsModal");
  };

  const closeModal = () => {
    if (inputNameRef.current) inputNameRef.current.value = "";
    if (inputHashRef.current) inputHashRef.current.value = "";
    closePopup("ImportFromIpfsModal");
  };

  return (
    <>
      <input
        type="checkbox"
        id="ImportFromIpfsModal"
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full lg:w-[700px] md:w-[500px] flex flex-col">
          <div className="w-full top-0 right-0 flex flex-row justify-between">
            <span></span>
            <span className="my-auto pl-8 text-white">Import CID</span>
            <label
              htmlFor="ImportFromIpfsModal"
              className="btn btn-sm btn-circle my-auto"
            >
              ✕
            </label>
          </div>
          <div className="flex flex-col mt-8">
            <label htmlFor="">CID (Hash)</label>
            <input
              placeholder="Qmdsfweg..sge"
              ref={inputHashRef}
              className="text-white py-2 text-center"
            />
            <label className="mt-4">Name (Alias)</label>
            <input
              type="text"
              placeholder="Orange cat bruhh"
              ref={inputNameRef}
              className="text-white py-2 text-center"
            />
            <div className="flex flex-row flex-wrap justify-between w-[250px] mx-auto mt-5">
              <button className="btn btn-success" onClick={saveNewHash}>
                Save
              </button>
              <button className="btn btn-error" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
