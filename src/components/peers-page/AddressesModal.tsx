import CopyIcon from "../CopyIcon";

export default function AddressesModal({
  addresses,
  copyString,
}: {
  addresses: string[];
  copyString: Function;
}) {
  return (
    <>
      <input type="checkbox" id="AddressesModal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div
          className="modal-box max-w-[90vw] w-[1200px] flex flex-col"
          style={{ maxWidth: "90vw" }}
        >
          <div className="w-full top-0 right-0 flex flex-row justify-between">
            <span></span>
            <span className="my-auto pl-8 text-white">Addresses</span>
            <label
              htmlFor="AddressesModal"
              className="btn btn-sm btn-circle my-auto"
            >
              ✕
            </label>
          </div>
          <div className="flex flex-col mt-8 overflow-x-auto whitespace-nowrap gap-3">
            {addresses.map((item) => (
              <div
                key={item}
                className="flex flex-row cursor-pointer hover:underline"
                onClick={() => copyString(item)}
              >
                <CopyIcon /> <span className="my-auto">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
