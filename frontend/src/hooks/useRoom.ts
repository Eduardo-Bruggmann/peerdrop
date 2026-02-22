import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { connectSocket, disconnectSocket } from '@/lib/socket/client'
import { setupSocketHandlers, joinRoom } from '@/lib/socket/handlers'
import * as peerManager from '@/lib/webrtc/peerManager'
import { useEffect, useState } from 'react'
import type Peer from 'simple-peer'

const { removeAllPeers, createPeer, removePeer, signalPeer } = peerManager

export function useRoom() {
  const { id } = useParams()
  const user = useSearchParams().get('user')
  const router = useRouter()
  const [peers, setPeers] = useState<string[]>([])

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
      ({ from, data }: { from: string; data: Peer.SignalData }) => {
        signalPeer(from, data)
      },
    )

    return cleanup
  }, [])

  useEffect(() => {
    if (id && user) joinRoom(String(id), user)
  }, [id, user])

  return { peers, roomId: id, user }
}
