'use client'

import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { createPeer, signalPeer, removePeer } from '@/lib/webrtc'
import { useEffect, useState } from 'react'
import { socket } from '@/lib/socket'
import Peer from 'simple-peer'

export default function Room() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const user = searchParams.get('user')
  const router = useRouter()

  const [peers, setPeers] = useState<string[]>([])

  useEffect(() => {
    if (!user?.trim()) {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    if (!socket.connected) socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    function handleExistingPeers(list: string[]) {
      setPeers(list)
    }

    function handlePeerJoined(peerId: string) {
      setPeers(prev => (prev.includes(peerId) ? prev : [...prev, peerId]))
    }

    function handlePeerLeft(peerId: string) {
      setPeers(prev => prev.filter(p => p !== peerId))
    }

    function handleSocketExistingPeers(ids: string[]) {
      handleExistingPeers(ids)

      ids.forEach(id => {
        if (!peers.includes(id)) createPeer(id, true)
      })
    }

    function handleSocketPeerJoined(id: string) {
      handlePeerJoined(id)

      createPeer(id, false)
    }

    function handleSocketSignal({
      from,
      data,
    }: {
      from: string
      data: Peer.SignalData
    }) {
      signalPeer(from, data)
    }

    function handleSocketPeerLeft(peerId: string) {
      handlePeerLeft(peerId)
      removePeer(peerId)
    }

    socket.on('existing-peers', handleSocketExistingPeers)
    socket.on('peer-joined', handleSocketPeerJoined)
    socket.on('peer-left', handleSocketPeerLeft)
    socket.on('signal', handleSocketSignal)

    return () => {
      socket.off('existing-peers', handleSocketExistingPeers)
      socket.off('peer-joined', handleSocketPeerJoined)
      socket.off('peer-left', handleSocketPeerLeft)
      socket.off('signal', handleSocketSignal)
    }
  }, [])

  useEffect(() => {
    if (!id || !user) return

    socket.emit('join-room', {
      roomId: id,
      nickname: user,
    })
  }, [id, user])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold text-center">
        Room: {id} — User: {user}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md min-w-75">
        <h2 className="font-semibold mb-3">Connected Peers</h2>

        {peers.length === 0 ? (
          <p className="text-gray-500">Waiting for someone...</p>
        ) : (
          <ul className="space-y-2">
            {peers.map(p => (
              <li key={p} className="bg-gray-100 p-2 rounded text-sm">
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
