import { GATEWAY_URL, TOKEN } from './constants.ts';
import { GatewayPayload, GatewayOpcodes, IdentifyPayload, HearbeatPayload } from './gateway/mod.ts';

export const Gateway = new WebSocket(GATEWAY_URL);

Gateway.onmessage = ({ data }) => {
  // deno-lint-ignore no-explicit-any
  const payload: GatewayPayload<any> = JSON.parse(data);

  switch (payload.op) {
    case GatewayOpcodes.HeartbeatACK:
      handleFirstConnection(payload);
      break;
    default:
      Deno.writeTextFile('./payload.json', JSON.stringify(payload));
  }
};

Gateway.onclose = () => console.log('WebSocket closed!');

Gateway.onerror = (err) => console.log('WebSocket error:', err);

function handleFirstConnection(payload: GatewayPayload<HearbeatPayload>) {
  const eventData = payload.d;

  // Handle Heartbeat
  setInterval(() => {
    const heartbeatPayload: GatewayPayload<null> = { op: GatewayOpcodes.Heartbeat, d: null };
    Gateway.send(JSON.stringify(heartbeatPayload));
  }, eventData.heartbeat_interval as number);

  // Handle Identify
  const identifyPayload: GatewayPayload<IdentifyPayload> = {
    op: GatewayOpcodes.Identify,
    d: {
      token: TOKEN,
      intents: 513,
      properties: {
        $os: 'linux',
        $browser: 'my_library',
        $device: 'my_library',
      },
    },
  };
  Gateway.send(JSON.stringify(identifyPayload));
}
