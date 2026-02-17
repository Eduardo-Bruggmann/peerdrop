import { socket } from './socket'
import Peer from 'simple-peer'

type PeerMap = Record<string, Peer.Instance>

const peers: PeerMap = {}

const ICE_CONFIG = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

const CHUNK_SIZE = 64 * 1024

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

  setTimeout(() => {
    if (!peer.connected) removePeer(peerId)
  }, 20000)

  return peer
}

function setupPeerEvents(peer: Peer.Instance, peerId: string) {
  let fileMeta: { name: string; size: number } | null = null
  let buffers: ArrayBuffer[] = []

  peer.on('connect', () => {
    console.log('P2P connected with', peerId)
  })

  peer.on('signal', data => {
    socket.emit('signal', { to: peerId, data })
  })

  peer.on('data', raw => {
    if (
      handleControlMessage(raw, buffers, fileMeta, meta => (fileMeta = meta))
    ) {
      buffers = []
      return
    }

    buffers.push(new Uint8Array(raw as Uint8Array).buffer)
  })

  peer.on('close', () => delete peers[peerId])
  peer.on('error', err => console.error('Peer error:', err))
}

function handleControlMessage(
  raw: Uint8Array,
  buffers: ArrayBuffer[],
  meta: any,
  setMeta: (m: any) => void,
) {
  try {
    const msg = JSON.parse(new TextDecoder().decode(raw))

    if (msg.type === 'meta') {
      setMeta(msg)
      buffers.length = 0
      return true
    }

    if (msg.type === 'done' && meta) {
      const blob = new Blob(buffers)
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = meta.name
      a.click()

      URL.revokeObjectURL(url)
      setMeta(null)
      return true
    }
  } catch {}

  return false
}

export function sendFile(peerId: string, file: File) {
  const peer = peers[peerId]
  if (!peer?.connected) return

  peer.send(JSON.stringify({ type: 'meta', name: file.name, size: file.size }))

  let offset = 0
  const reader = new FileReader()

  reader.onload = e => {
    if (!e.target?.result) return

    peer.send(e.target.result as ArrayBuffer)
    offset += CHUNK_SIZE

    offset < file.size
      ? readSlice(offset)
      : peer.send(JSON.stringify({ type: 'done' }))
  }

  function readSlice(o: number) {
    reader.readAsArrayBuffer(file.slice(o, o + CHUNK_SIZE))
  }

  readSlice(0)
}

export function signalPeer(from: string, data: Peer.SignalData) {
  if (!data) return

  const peer = peers[from] ?? createPeer(from, false)
  peer.signal(data)
}

export function removePeer(peerId: string) {
  peers[peerId]?.destroy()
  delete peers[peerId]
}

export function removeAllPeers() {
  Object.keys(peers).forEach(removePeer)
}
