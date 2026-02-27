import { socketClient } from '../socket/client'
import type Peer from 'simple-peer'

function isStringMessage(data: unknown): boolean {
  return typeof data === 'string'
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()

  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}

export function setupPeerEvents(peer: Peer.Instance, peerId: string) {
  let fileMeta: { name: string; size: number } | null = null
  let buffers: ArrayBuffer[] = []

  peer.on('connect', () => {
    console.log('P2P connected with', peerId)
  })

  peer.on('signal', data => {
    socketClient.emit('signal', { to: peerId, data })
  })

  peer.on('data', raw => {
    if (isStringMessage(raw)) {
      try {
        const msg = JSON.parse(raw as string)

        if (msg.type === 'meta') {
          fileMeta = { name: msg.name, size: msg.size }
          buffers = []
          return
        }

        if (msg.type === 'done' && fileMeta) {
          const blob = new Blob(buffers)
          downloadBlob(blob, fileMeta.name)
          fileMeta = null
          buffers = []
          return
        }
      } catch (error) {
        console.error('Failed to parse peer message:', error)
      }
      return
    }

    if (raw instanceof ArrayBuffer) {
      buffers.push(raw)
    } else {
      buffers.push(new Uint8Array(raw as Uint8Array).buffer)
    }
  })

  peer.on('close', () => {
    fileMeta = null
    buffers = []
  })

  peer.on('error', err => console.error('Peer error:', err))
}
