"use client";

import { HOSTNAME } from "@/const";
import { useNodeInfo } from "../NodeProvider";
import { useState } from "react";
import CopyIcon from "../CopyIcon";
import { useNodeConfig } from "../ConfigProvider";
import BandwidthComponent from "./BandwidthComponent";

export default function StatusPageComponent() {
  const nodeInfo = useNodeInfo();
  const { nodeConfig } = useNodeConfig();
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
        <div className="mx-auto flex flex-row flex-wrap justify-center gap-5 w-[1000px]">
          <div className="flex flex-col border border-gray p-3 flex-grow">
            <div className="font-bold text-blue-500">INFO</div>
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
            <div>
              <b>API:</b> {nodeConfig.Addresses.API}{" "}
              <label
                htmlFor=""
                className="cursor-pointer underline text-blue-500 font-bold"
              >
                Edit
              </label>
            </div>
          </div>

          <BandwidthComponent />
        </div>

        <details className="mt-8 bg-gray-700 w-[1000px] mx-auto">
          <summary className="border-b cursor-pointer pl-4 py-2">
            Addresses
          </summary>
          <div className="flex flex-col whitespace-nowrap pl-4 overflow-x-auto gap-2 py-4">
            {nodeInfo?.Addresses.map((item) => (
              <div
                key={item}
                className="flex flex-row cursor-pointer hover:underline"
                onClick={() => copyString(item)}
              >
                <CopyIcon />{" "}
                <span className="my-auto max-w-[930px] overflow-x-hidden">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </details>

        <details className="mt-8 bg-gray-700 w-[1000px] mx-auto">
          <summary className="border-b cursor-pointer pl-4 py-2">
            Protocols
          </summary>
          <div className="flex flex-col whitespace-nowrap pl-4 overflow-x-auto gap-2 py-4">
            {nodeInfo?.Protocols.map((item) => (
              <div
                key={item}
                className="flex flex-row cursor-pointer hover:underline"
                onClick={() => copyString(item)}
              >
                <CopyIcon />{" "}
                <span className="my-auto max-w-[930px] overflow-x-hidden">
                  {item}
                </span>
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
