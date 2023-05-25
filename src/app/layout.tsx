// 'use server';
import { BASE_URL } from "@/const";
import "./globals.css";
import NodeProvider, { TNodeInfo } from "@/components/NodeProvider";
import TabLayout from "@/components/TabLayout";
import ConfigProvider from "@/components/ConfigProvider";
import { TNodeConfig, fetchNodeConfig } from "@/utils/api";

export const metadata = {
  title: "IPFS Client",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.time("started fetching pins");
  const res: TNodeInfo = await fetch(`${BASE_URL}/id`, { method: "POST" })
    .then((r) => r.json())
    .catch((err) => console.error(err));
  console.timeEnd("started fetching pins");
  const config: TNodeConfig = await fetchNodeConfig();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-[100vh] overflow-y-scroll flex flex-col">
        <NodeProvider _nodeInfo={res}>
          <ConfigProvider _config={config}>
            <TabLayout>{children}</TabLayout>
          </ConfigProvider>
        </NodeProvider>
      </body>
    </html>
  );
}
