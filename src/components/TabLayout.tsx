"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useNodeInfo } from "./NodeProvider";

const tabs = [
  {
    pathname: "/status",
    label: "Status",
  },
  {
    pathname: "/",
    label: "Files",
  },
  {
    pathname: "/peers",
    label: "Peers",
  },
  { pathname: "/settings", label: "Settings" },
];

export default function TabLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const nodeInfo = useNodeInfo();
  return (
    <>
      <div className="tabs tabs-boxed mx-auto justify-center rounded-none fixed w-full z-50">
        {tabs.map((tab) => (
          <Link
            href={tab.pathname}
            key={tab.pathname}
            className={`tab w-[100px] ${
              tab.pathname === pathname ? "tab-active" : ""
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {nodeInfo && nodeInfo.ID ? (
        <>{children}</>
      ) : (
        <div className="mx-auto text-center mt-20">Node is not connected</div>
      )}
    </>
  );
}
