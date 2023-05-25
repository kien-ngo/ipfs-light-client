import { IOpenPeerModified } from "@/utils/api";
import { truncateString } from "@/utils/string";
import { memo, useState } from "react";
import AddressesModal from "./AddressesModal";

const PeerList = ({ peers }: { peers: IOpenPeerModified[] }) => {
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
  const copyPeerList = (peerId: string) => {
    window.navigator.clipboard.writeText(peerId);
  };
  const [showStringCopyToast, setShowStringCopyToast] =
    useState<boolean>(false);
  const copyString = (val: string) => {
    window.navigator.clipboard.writeText(val);
    setShowStringCopyToast(true);
    setTimeout(() => setShowStringCopyToast(false), 2000);
  };
  return (
    <>
      <div className="overflow-x-auto mx-auto w-[1400px] max-w-[90vw] mt-10 pb-40">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              {/* <th>Location</th> */}
              <th>Latency</th>
              <th>Peer ID</th>
              <th>Connection</th>
              <th>Open streams</th>
              <th>Addresses</th>
            </tr>
          </thead>
          <tbody>
            {peers.map((item) => (
              <tr className="hover" key={item.Identify.ID}>
                <th>{item.indexLabel}</th>
                {/* <th>{item.location}</th> */}
                <th>{item.Latency}</th>
                <th>
                  <span
                    className="cursor-pointer"
                    onClick={() => copyPeerList(item.Peer)}
                  >
                    {truncateString(item.Peer)}
                  </span>
                </th>
                <th>{truncateString(item.connection)}</th>
                <th>{truncateString(item.openStream)}</th>
                <th>
                  <label
                    className="cursor-pointer"
                    htmlFor="AddressesModal"
                    onClick={() =>
                      setSelectedAddresses(item.Identify.Addresses)
                    }
                  >
                    View
                  </label>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        {peers.length < 1 && (
          <div className="text-center mt-6">No peer found</div>
        )}
      </div>
      <AddressesModal addresses={selectedAddresses} copyString={copyString} />
      {showStringCopyToast && (
        <div className="toast toast-top mt-10">
          <div className="alert alert-success">
            <div>
              <span>String copied.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(PeerList);
