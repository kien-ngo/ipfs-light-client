import { IOpenPeerModified } from "@/utils/api";
import { truncateString } from "@/utils/string";
import { memo, useState } from "react";
import AddressesModal from "./AddressesModal";

const PeerList = ({ peers }: { peers: IOpenPeerModified[] }) => {
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
  const copyPeerList = (peerId: string) => {
    window.navigator.clipboard.writeText(peerId);
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
              <tr className="hover" key={item.Peer}>
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
      </div>
      <AddressesModal addresses={selectedAddresses} />
    </>
  );
};

export default memo(PeerList);
