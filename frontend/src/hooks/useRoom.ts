import { useParams, useSearchParams, useRouter } from 'next/navigation'
import {
  socketClient,
  connectSocket,
  disconnectSocket,
} from '@/lib/socket/client'
import { setupSocketHandlers, joinRoom } from '@/lib/socket/handlers'
import * as peerManager from '@/lib/webrtc/peerManager'
import { useEffect, useRef, useState } from 'react'
import type Peer from 'simple-peer'

const { removeAllPeers, createPeer, removePeer, signalPeer } = peerManager

export function useRoom() {
  const { id } = useParams()
  const user = useSearchParams().get('user')
  const router = useRouter()
  const [peers, setPeers] = useState<string[]>([])
  const joinedRef = useRef(false)

  useEffect(() => {
    if (!user?.trim()) router.push('/')
  }, [user, router])

  useEffect(() => {
    removeAllPeers()
    connectSocket()

    const unload = () => disconnectSocket()
    window.addEventListener('beforeunload', unload)

    return () => {
      window.removeEventListener('beforeunload', unload)
      removeAllPeers()
      disconnectSocket()
    }
  }, [])

  useEffect(() => {
    const cleanup = setupSocketHandlers(
      (ids: string[]) => {
        removeAllPeers()
        setPeers(ids)
        ids.forEach(id => createPeer(id, true))
      },
      (id: string) => {
        setPeers(p => (p.includes(id) ? p : [...p, id]))
        createPeer(id, false)
      },
      (id: string) => {
        setPeers(p => p.filter(x => x !== id))
        removePeer(id)
      },
      (id: string) => {
        removePeer(id)
        createPeer(id, false)
      },
      ({ from, data }: { from: string; data: Peer.SignalData }) => {
        signalPeer(from, data)
      },
    )

    return cleanup
  }, [])

  // Join room once the socket is connected, and re-join on reconnects
  useEffect(() => {
    if (!id || !user) return

    const roomId = String(id)

    const doJoin = () => {
      joinRoom(roomId, user)
      joinedRef.current = true
    }

    // If socket is already connected, join immediately
    if (socketClient.connected) {
      doJoin()
    }

    // (Re)join when socket (re)connects
    socketClient.on('connect', doJoin)

    return () => {
      socketClient.off('connect', doJoin)
    }
  }, [id, user])

  return { peers, roomId: id, user }
}
