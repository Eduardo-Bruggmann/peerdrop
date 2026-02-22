import { socketClient } from '../socket/client'
import type Peer from 'simple-peer'

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
    try {
      const msg = JSON.parse(new TextDecoder().decode(raw))

      if (msg.type === 'meta') {
        fileMeta = msg
        buffers = []
        return
      }

      if (msg.type === 'done' && fileMeta) {
        const blob = new Blob(buffers)
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = fileMeta.name
        a.click()

        URL.revokeObjectURL(url)
        fileMeta = null
        buffers = []
        return
      }
    } catch {}

    buffers.push(new Uint8Array(raw as Uint8Array).buffer)
  })

  peer.on('close', () => {
    fileMeta = null
    buffers = []
  })

  peer.on('error', err => console.error('Peer error:', err))
}
