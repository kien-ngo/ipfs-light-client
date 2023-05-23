import { useRef } from "react";
import { closePopup } from "../../utils/modal";

type Props = {
  defaultValue: string;
  saveFn: Function;
  closeFn: Function;
};

export default function ChangePathNameModal(props: Props) {
  const { defaultValue, saveFn, closeFn } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const cancel = () => {
    closeFn();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === "Esc") {
      closeFn();
      closePopup("ChangePathNameModal");
      return;
    }
    if (event.key === "Enter") {
      saveFn(inputRef.current?.value.trim());
      closePopup("ChangePathNameModal");
    }
  };
  return (
    <>
      <input
        type="checkbox"
        id="ChangePathNameModal"
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full lg:w-[700px] md:w-[500px] flex flex-col">
          <div className="w-full top-0 right-0 flex flex-row justify-between">
            <span></span>
            <span className="my-auto pl-8 text-white">Edit name</span>
            <label
              htmlFor="ChangePathNameModal"
              className="btn btn-sm btn-circle my-auto"
            >
              ✕
            </label>
          </div>
          <div className="flex flex-col mt-8">
            <input
              ref={inputRef}
              onKeyUp={handleKeyUp}
              className="text-white p-4 text-lg text-center"
              defaultValue={defaultValue}
            />
            <div className="flex flex-row flex-wrap justify-between w-[250px] mx-auto mt-5">
              <label
                htmlFor="ChangePathNameModal"
                className="btn btn-success"
                onClick={() => saveFn(inputRef.current?.value.trim())}
              >
                Save
              </label>
              <label
                htmlFor="ChangePathNameModal"
                className="btn btn-error"
                onClick={cancel}
              >
                Cancel
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
