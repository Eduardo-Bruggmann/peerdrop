import { getPeer } from './peerManager'

// 16 KB — safe for all mobile browsers / data channels
const CHUNK_SIZE = 16 * 1024
// Pause sending when buffered data exceeds this threshold
const MAX_BUFFERED = 256 * 1024

export function sendFile(peerId: string, file: File) {
  const peer = getPeer(peerId)
  if (!peer?.connected) return

  // Send metadata as a plain string so the receiver can distinguish text vs binary
  peer.send(JSON.stringify({ type: 'meta', name: file.name, size: file.size }))

  const reader = new FileReader()
  let offset = 0

  const readChunk = () => {
    const chunk = file.slice(offset, offset + CHUNK_SIZE)
    reader.readAsArrayBuffer(chunk)
  }

  const scheduleNext = () => {
    if (offset >= file.size) {
      peer.send(JSON.stringify({ type: 'done' }))
      return
    }

    // Back-pressure: wait if the data channel buffer is full
    const dc = (peer as any)._channel as RTCDataChannel | undefined
    if (dc && dc.bufferedAmount > MAX_BUFFERED) {
      setTimeout(scheduleNext, 50)
      return
    }

    readChunk()
  }

  reader.onload = () => {
    peer.send(reader.result as ArrayBuffer)
    offset += CHUNK_SIZE
    scheduleNext()
  }

  reader.onerror = error => {
    console.error('Failed to read file chunk:', error)
  }

  readChunk()
}
