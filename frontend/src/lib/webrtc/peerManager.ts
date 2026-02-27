import { setupPeerEvents } from './events'
import Peer from 'simple-peer'

type PeerMap = Record<string, Peer.Instance>
const peers: PeerMap = {}

const ICE_CONFIG = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

export function createPeer(peerId: string, initiator: boolean) {
  if (peers[peerId] && !peers[peerId].destroyed) {
    return peers[peerId]
  }

  const peer = new Peer({
    initiator,
    trickle: true,
    config: ICE_CONFIG,
  })

  peers[peerId] = peer
  setupPeerEvents(peer, peerId)

  const timeout = setTimeout(() => {
    if (!peer.connected) removePeer(peerId)
  }, 20000)

  peer.once('close', () => clearTimeout(timeout))

  return peer
}

export function getPeer(peerId: string) {
  return peers[peerId]
}

export function removePeer(peerId: string) {
  const peer = peers[peerId]
  if (peer) {
    peer.destroy()
    delete peers[peerId]
  }
}

export function signalPeer(peerId: string, data: Peer.SignalData) {
  const peer = peers[peerId]
  if (peer) peer.signal(data)
}

export function removeAllPeers() {
  Object.values(peers).forEach(peer => peer.destroy())
  Object.keys(peers).forEach(key => delete peers[key])
}
