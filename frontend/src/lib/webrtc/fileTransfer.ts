import { getPeer } from './peerManager'

const CHUNK_SIZE = 64 * 1024

export function sendFile(peerId: string, file: File) {
  const peer = getPeer(peerId)
  if (!peer?.connected) return

  peer.send(JSON.stringify({ type: 'meta', name: file.name, size: file.size }))

  const reader = new FileReader()
  let offset = 0

  const readChunk = () => {
    const chunk = file.slice(offset, offset + CHUNK_SIZE)
    reader.readAsArrayBuffer(chunk)
  }

  reader.onload = () => {
    peer.send(reader.result as ArrayBuffer)
    offset += CHUNK_SIZE

    if (offset < file.size) {
      readChunk()
    } else {
      peer.send(JSON.stringify({ type: 'done' }))
    }
  }

  readChunk()
}
