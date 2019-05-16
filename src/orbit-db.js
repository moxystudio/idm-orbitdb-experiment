import Ipfs from 'ipfs';
import OrbitDb from 'orbit-db';

const createIpfs = (ipfs) => {
    return new Promise((resolve, reject) => {
        const node = new Ipfs({
            pass: '12345678912345678911',
            EXPERIMENTAL: {
                pubsub: true,
            },
            start: true,
            // preload: { enabled: true },
            // config: {
            //     Addresses: {
            //       Swarm: [
            //         // Use IPFS dev signal server
            //         // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
            //         '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
            //         // Use local signal server
            //         // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
            //       ]
            //     },
            // }
        });

        node.on('ready', () => resolve(node));
        node.on('error', (err) => reject(err));
    });
};

const createOrbitDb = async (ipfs, options) => OrbitDb.createInstance(ipfs, { ...options });

export { createIpfs, createOrbitDb };
