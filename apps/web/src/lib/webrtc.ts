import { socket } from './socket'
import Peer from 'simple-peer'

type PeerMap = Record<string, Peer.Instance>

const peers: PeerMap = {}

const ICE_CONFIG = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

export function createPeer(peerId: string, initiator: boolean) {
  const existing = peers[peerId]

  if (existing && !existing.destroyed) {
    return existing
  }

  const peer = new Peer({
    initiator,
    trickle: true,
    config: ICE_CONFIG,
  })

  setTimeout(() => {
    if (!peer.connected) {
      peer.destroy()
      delete peers[peerId]
    }
  }, 20000)

  peer.on('connect', () => {
    console.log('P2P connected with', peerId)
  })

  peer.on('data', data => {
    console.log('Received data from', peerId, ':', data.toString())
  })

  peer.on('signal', data => {
    socket.emit('signal', {
      to: peerId,
      data,
    })
  })

  peer.on('close', () => {
    delete peers[peerId]
  })

  peer.on('error', err => {
    console.error(`Peer error for peerId ${peerId}:`, err)
  })

  peers[peerId] = peer

  return peer
}

export function signalPeer(from: string, data: Peer.SignalData) {
  if (!data || typeof data !== 'object') return

  const peer = peers[from]

  if (!peer || peer.destroyed) {
    const newPeer = createPeer(from, false)
    newPeer.signal(data)
    return
  }

  peer.signal(data)
}

export function removePeer(peerId: string) {
  const peer = peers[peerId]

  if (peer && !peer.destroyed) {
    peer.destroy()
  }

  delete peers[peerId]
}
