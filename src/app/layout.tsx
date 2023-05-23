import { BASE_URL } from "@/const";
import "./globals.css";
import NodeProvider, { TNodeInfo } from "@/components/NodeProvider";
import TabLayout from "@/components/TabLayout";

export const metadata = {
  title: "IPFS Client",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res: TNodeInfo = await fetch(`${BASE_URL}/id`, { method: "POST" })
    .then((r) => r.json())
    .catch((err) => console.error(err));

  return (
    <html lang="en">
      <body className="min-h-[100vh] overflow-y-scroll">
        <NodeProvider _nodeInfo={res}>
          <TabLayout>{children}</TabLayout>
        </NodeProvider>
      </body>
    </html>
  );
}
