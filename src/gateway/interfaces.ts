export enum GatewayOpcodes {
  Dispatch,
  Heartbeat,
  Identify,
  PresenceUpdate,
  VoiceStateUpdate,
  Resume,
  Reconnect,
  RequestGuildMembers,
  InvalidSession,
  Hello,
  HeartbeatACK,
}

export interface GatewayPayload<T> {
  op: GatewayOpcodes;
  d: T;
  s?: number;
  t?: string;
}

export interface HearbeatPayload {
  // deno-lint-ignore camelcase
  heartbeat_interval: number;
  _trace: string;
}

export interface IdentifyPayload {
  token: string;
  intents: number;
  properties: {
    $os: string;
    $browser: string;
    $device: string;
  };
}
