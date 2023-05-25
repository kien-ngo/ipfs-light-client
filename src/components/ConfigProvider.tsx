"use client";

import { TNodeConfig } from "@/utils/api";
import { ReactNode, createContext, useContext, useState } from "react";

type TProps = {
  nodeConfig: TNodeConfig;
  setNodeConfig: Function;
};

// @ts-ignore
const Context = createContext<TProps>();

export default function ConfigProvider({
  children,
  _config,
}: {
  children: ReactNode;
  _config: TNodeConfig;
}) {
  const [nodeConfig, setNodeConfig] = useState<TNodeConfig>(_config);
  console.log(_config);
  return (
    <Context.Provider value={{ nodeConfig, setNodeConfig }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useNodeConfig = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useNodeInfo must be used inside NodeProvider");
  }
  return context;
};
