import PeerPageWrapper from "@/components/peers-page/PeersPageWrapper";
import { fetchOpenPeers } from "@/utils/api";

export default async function Page() {
  console.time("started fetching peers");
  const peers = await fetchOpenPeers();
  console.timeEnd("started fetching peers");
  return <PeerPageWrapper _peers={peers} />;
}
