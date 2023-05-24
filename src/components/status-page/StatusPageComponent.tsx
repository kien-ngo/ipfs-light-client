"use client";

import { HOSTNAME } from "@/const";
import { useNodeInfo } from "../NodeProvider";
import { useState } from "react";

const CopyIcon = () => {
  return (
    <svg viewBox="0 0 48 48" width={18} height={18} className="mr-2 my-auto">
      <path d="M0 0h48v48H0z" fill="none"></path>
      <path
        d="M32 2H8C5.79 2 4 3.79 4 6v28h4V6h24V2zm6 8H16c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h22c2.21 0 4-1.79 4-4V14c0-2.21-1.79-4-4-4zm0 32H16V14h22v28z"
        fill="#ffffff"
      ></path>
    </svg>
  );
};

export default function StatusPageComponent() {
  const nodeInfo = useNodeInfo();
  const [showStringCopyToast, setShowStringCopyToast] =
    useState<boolean>(false);
  const copyString = (val: string) => {
    window.navigator.clipboard.writeText(val);
    setShowStringCopyToast(true);
    setTimeout(() => setShowStringCopyToast(false), 2000);
  };
  return (
    <>
      <div className="pt-20 flex flex-col mx-auto px-6 w-full">
        <div>
          <b>Peer ID:</b> {nodeInfo?.ID}
        </div>
        <div>
          <b>Agent:</b> {nodeInfo?.AgentVersion}
        </div>
        <div>
          <b>Protocol version:</b> {nodeInfo?.ProtocolVersion}
        </div>
        <div>
          <b>Public key:</b> {nodeInfo?.PublicKey}
        </div>
        <div>
          <b>Gateway:</b> {HOSTNAME}
        </div>
        {/* <div>API: {}</div> */}

        <details className="mt-8 bg-gray-700">
          <summary className="border-b cursor-pointer">Addresses</summary>
          <div className="flex flex-col whitespace-nowrap pl-4 overflow-x-auto gap-2 py-4">
            {nodeInfo?.Addresses.map((item) => (
              <div
                key={item}
                className="flex flex-row cursor-pointer hover:underline"
                onClick={() => copyString(item)}
              >
                <CopyIcon /> <span className="my-auto">{item}</span>
              </div>
            ))}
          </div>
        </details>

        <details className="mt-8 bg-gray-700">
          <summary className="border-b cursor-pointer">Protocols</summary>
          <div className="flex flex-col whitespace-nowrap pl-4 overflow-x-auto gap-2 py-4">
            {nodeInfo?.Protocols.map((item) => (
              <div
                key={item}
                className="flex flex-row cursor-pointer hover:underline"
                onClick={() => copyString(item)}
              >
                <CopyIcon /> <span className="my-auto">{item}</span>
              </div>
            ))}
          </div>
        </details>
      </div>
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
}
