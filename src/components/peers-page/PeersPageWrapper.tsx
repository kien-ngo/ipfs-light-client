"use client";

import { IOpenPeerModified, fetchOpenPeers } from "@/utils/api";
import { useRef, useState } from "react";
import PeerList from "./PeerList";
import ScrollTopButton from "../home-page/ScrollTopButton";

export default function PeerPageWrapper({
  _peers,
}: {
  _peers: IOpenPeerModified[];
}) {
  let timer: NodeJS.Timeout | null = null;
  const [peers, setPeers] = useState<IOpenPeerModified[]>(_peers);
  const [filteredPeers, setFilteredPeers] =
    useState<IOpenPeerModified[]>(_peers);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Pagination
  const [qtyPerPage, setQtyPerPage] = useState<number>(50);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const startIndex = (currentPageNum - 1) * qtyPerPage;
  const endIndex = startIndex + qtyPerPage;
  const currentPageItems: IOpenPeerModified[] = filteredPeers.slice(
    startIndex,
    endIndex
  );
  const totalPages = Math.ceil(filteredPeers.length / qtyPerPage);
  const pages = Array(totalPages)
    .fill(0)
    .map((_, index) => index + 1);
  const updatePeerList = async () => {
    const __peers = await fetch("/api/swarm/peers").then((r) => r.json());
    setPeers(__peers);
  };

  const searchItem = (keyword: string) => {
    if (!keyword) return setFilteredPeers(peers);
    keyword = keyword.toLowerCase();
    const res = peers.filter((item) =>
      item.Peer.toLowerCase().includes(keyword)
    );
    setFilteredPeers(res);
  };

  const debounceSearch = (newValue: string) => {
    clearTimeout(timer as NodeJS.Timeout);
    timer = setTimeout(() => {
      searchItem(newValue);
    }, 200);
  };

  const PaginationContainer = () => {
    if (pages.length === 1) return <></>;
    return (
      <div className="flex flex-row mx-auto justify-center mt-8">
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

  return (
    <>
      <div className="flex flex-col pt-20">
        <div className="mx-auto text-center font-bold text-6xl">
          {peers.length}
        </div>
        <div className="mx-auto text-center text-2xl">Peers discovered</div>
        <div className="mx-auto text-center text-sm mt-4">
          Data refreshes every 1 minute.{" "}
          <button className="underline" onClick={updatePeerList}>
            Refresh now
          </button>
        </div>
        <label htmlFor="" className="btn w-fit mx-auto btn-primary mt-4">+ Add new peer</label>
      </div>
      <div className="relative mx-auto mt-6">
        <input
          type="text"
          ref={searchInputRef}
          onChange={(e) => debounceSearch(e.target.value)}
          placeholder="Search for Peer ID"
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
      <div className="flex flex-row justify-center w-full max-w-[90vw] mx-auto mt-8">
        {/* No. per page */}
        <div className="flex flex-row w-fit mr-4 border hover:border-white border-transparent pl-2">
          <div>Qty/page&nbsp;</div>
          <select
            className="w-fit pl-1 cursor-pointer"
            onChange={(e) => setQtyPerPage(parseInt(e.target.value))}
          >
            {[50, 100, 200, 400, 800, 1600].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
      <PaginationContainer />
      <PeerList peers={currentPageItems} />
      <ScrollTopButton />
    </>
  );
}
