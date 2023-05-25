import { BASE_URL } from "@/const";
// Example
// {"Name":"0-99 URI","Type":0,"Size":0,"Hash":""}
export type FilePath = {
  Name: string;
  Type: number;
  Size: number;
  Hash: string;
};

// Example
// {
//   "Hash":"QmPK42mHojJCUAe21rHiQscEWfxCspbrvo7941xuWT1hmR",
//   "Size":0,
//   "CumulativeSize":950499619,
//   "Blocks":4000,
//   "Type":"directory"
// }
interface IStat {
  Hash: string;
  Size: number;
  CumulativeSize: number;
  Blocks: number;
  Type: "directory" | "file";
}

export interface IFileStat extends IStat {
  Path: string;
}

// Example
// {
//   "Name":"Label of this pin",
//   "Type":0,
//   "Size":0,
//   "Hash":""
// }
export type PinType = "recursive" | "all" | "direct" | "indirect";

export type PinObj = {
  Keys: {
    [key in string]: {
      type: PinType;
    };
  };
};

export async function fetchFileStat(path: string): Promise<IFileStat> {
  const res = await fetch(`${BASE_URL}/files/stat?arg=/${encodeURI(path)}`, {
    method: "POST",
  });
  const data: IStat = await res.json();
  const fileStat: IFileStat = Object.assign(data, { Path: path });
  return fileStat;
}

export async function fetchFilePaths(): Promise<FilePath[]> {
  const res = await fetch(`${BASE_URL}/files/ls`, {
    method: "POST",
  });
  const data: { Entries: FilePath[] } = await res.json();
  const files: FilePath[] = data.Entries ?? [];
  return files;
}
export async function fetchPins(type: PinType = "recursive"): Promise<PinObj> {
  const res = await fetch(
    `${BASE_URL}/pin/ls?type=${type ? type : "recursive"}`,
    {
      method: "POST",
    }
  );
  const data: PinObj = await res.json();
  return data;
}

interface IOpenPeer {
  Addr: `/${string}/${string}/${string}/${string}`;
  Peer: string;
  Latency: string;
  Direction: number;
  Streams: { Protocol: string }[];
  Identify: {
    ID: string;
    PublicKey: string;
    Addresses: string[];
    AgentVersion: string;
    ProtocolVersion: string;
    Protocols: string[];
  };
}

export interface IOpenPeerModified extends IOpenPeer {
  ipAddress: string;
  ipVersion: string;
  protocol: string;
  port: string;
  location: string;
  connection: string;
  openStream: string;
  indexLabel: number;
}

export async function fetchOpenPeers(): Promise<IOpenPeerModified[]> {
  const peerList: { Peers: IOpenPeer[] } = await fetch(
    `${BASE_URL}/swarm/peers?verbose=true&streams=true&latency=true&direction=true&identify=true`,
    { method: "POST" }
  ).then((r) => r.json());
  const peers: IOpenPeerModified[] = peerList.Peers.map((item, index) => {
    const [ipVersion, ipAddress, protocol, port, transport] =
      item.Addr.substring(1).split("/");
    const obj = {
      ipVersion,
      ipAddress,
      protocol,
      port,
      location: "Unknown",
      connection: `${ipVersion}*${protocol}*${transport ?? ""}`,
      openStream: item.Streams?.map((o) => o.Protocol).join(", ") ?? "N/A",
      indexLabel: index + 1,
    };
    const res: IOpenPeerModified = Object.assign(item, obj);
    return res;
  });
  return peers;
}

export type TNodeConfig = {
  API: {
    HTTPHeaders: {
      "Access-Control-Allow-Origin": string[];
    };
  };
  Addresses: {
    API: string;
    Announce: any[];
    AppendAnnounce: any[];
    Gateway: string;
    NoAnnounce: any[];
    Swarm: string[];
  };
  AutoNAT: {};
  Bootstrap: string[];
  DNS: {
    Resolvers: {};
  };
  Datastore: {
    BloomFilterSize: number;
    GCPeriod: string;
    HashOnRead: false;
    Spec: {
      mounts: any[];
      type: string;
    };
    StorageGCWatermark: number;
    SotrageMax: string;
  };
  Discovery: {
    MNDS: {
      Enabled: boolean;
    };
  };
  Experimental: {
    AcceleratedDHTClient: boolean;
    FilestoreEnabled: boolean;
    GraphsyncEnabled: boolean;
    Libp2pStreamMounting: boolean;
    OptimisticProvide: boolean;
    OptimisticProvideJobsPoolSize: number;
    P2pHttpProxy: boolean;
    StrategicProviding: boolean;
    UrlstoreEnabled: boolean;
  };
  Gateway: {
    APICommands: string[];
    HTTPHeaders: {
      "Access-Control-Allow-Headers": string[];
      "Access-Control-Allow-Methods": string[];
      "Access-Control-Allow-Origin": string[];
    };
    NoDNSLink: boolean;
    NoFetch: boolean;
    PathPrefixes: any[];
    PublicGateways: any;
    RootRedirect: string;
    Writable: boolean;
  };
  Identity: {
    PeerID: string;
  };
  Internal: any;
  Ipns: {
    RecordLifetime: string;
    RepublishPeriod: string;
    ResolveCacheSize: number;
  };
  Migration: { DownloadSources: any[]; Keep: string };
  Mounts: { FuseAllowOther: boolean; IPFS: string; IPNS: string };
  Peering: {
    Peers: [
      {
        Addrs: string[];
        ID: string;
      }
    ];
  };
  Pinning: {
    RemoteServices: {
      [key in string]: {
        API: { Endpoint: string };
        Policies: {
          MFS: { Enable: boolean; PinName: string; RepinInterval: string };
        };
      };
    };
  };
  Plugins: { Plugins: any };
  Provider: { Strategy: string };
  Pubsub: { DisableSigning: boolean; Router: string };
  Reprovider: any;
  Routing: { Methods: any; Routers: any };
  Swarm: {
    AddrFilters: any;
    ConnMgr: {
      GracePeriod: string;
      HighWater: number;
      LowWater: number;
      Type: string;
    };
    DisableBandwidthMetrics: boolean;
    DisableNatPortMap: boolean;
    RelayClient: any;
    RelayService: any;
    ResourceMgr: { Limits: any };
    Transports: { Multiplexers: any; Network: any; Security: any };
  };
};

export async function fetchNodeConfig(): Promise<TNodeConfig> {
  const config: TNodeConfig = await fetch(`${BASE_URL}/config/show`, {
    method: "POST",
  }).then((r) => r.json());
  return config;
}

export type TBandwidthStats = {
  TotalIn: number;
  TotalOut: number;
  RateIn: number;
  RateOut: number;
};

export async function fetchBandwidthStats(): Promise<TBandwidthStats> {
  const stats: TBandwidthStats = await fetch("/api/stats/bw").then((r) =>
    r.json()
  );
  return stats;
}
