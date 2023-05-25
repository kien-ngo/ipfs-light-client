import { TBandwidthStats, fetchBandwidthStats } from "@/utils/api";
import { formatBytes } from "@/utils/number";
import { useEffect, useState } from "react";

export default function BandwidthComponent() {
  const [bandwidth, setBandwidth] = useState<TBandwidthStats>();
  useEffect(() => {
    const get = async () => {
      const stats: TBandwidthStats = await fetchBandwidthStats();
      console.log(stats);
      setBandwidth(stats);
    };
    const reload = setInterval(() => get(), 4000);
    return () => {
      clearInterval(reload);
    };
  }, []);
  return (
    <div className="flex flex-col border border-gray p-3">
      <div className="font-bold text-blue-500">BANDWIDTH</div>
      <div className="text-sm text-gray-400">
        Data refreshes every 4 seconds
      </div>
      {bandwidth ? (
        <>
          <div>
            <b>Total In: {formatBytes(bandwidth.TotalIn)}</b>
          </div>
          <div>
            <b>Total Out: {formatBytes(bandwidth.TotalOut)}</b>
          </div>
          <div>
            <b>Rate In: {formatBytes(bandwidth.RateIn)}/s</b>
          </div>
          <div>
            <b>Rate Out: {formatBytes(bandwidth.RateOut)}/s</b>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
