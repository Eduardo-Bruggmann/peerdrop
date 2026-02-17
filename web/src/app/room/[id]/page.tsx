'use client'

import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import * as webrtc from '@/lib/webrtc'
import { socket } from '@/lib/socket'
import type Peer from 'simple-peer'

const { createPeer, signalPeer, removePeer, removeAllPeers, sendFile } = webrtc

export default function Room() {
  const { id } = useParams()
  const user = useSearchParams().get('user')
  const router = useRouter()

  const [peers, setPeers] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user?.trim()) router.push('/')
  }, [user, router])

  useEffect(() => {
    removeAllPeers()
    socket.connect()

    const unload = () => socket.disconnect()
    window.addEventListener('beforeunload', unload)

    return () => {
      window.removeEventListener('beforeunload', unload)
      removeAllPeers()
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const onExisting = (ids: string[]) => {
      removeAllPeers()
      setPeers(ids)
      ids.forEach(id => createPeer(id, true))
    }

    const onJoin = (id: string) => {
      setPeers(p => (p.includes(id) ? p : [...p, id]))
      createPeer(id, false)
    }

    const onLeave = (id: string) => {
      setPeers(p => p.filter(x => x !== id))
      removePeer(id)
    }

    const onSignal = ({
      from,
      data,
    }: {
      from: string
      data: Peer.SignalData
    }) => signalPeer(from, data)

    socket.on('existing-peers', onExisting)
    socket.on('peer-joined', onJoin)
    socket.on('peer-left', onLeave)
    socket.on('signal', onSignal)

    return () => {
      socket.off('existing-peers', onExisting)
      socket.off('peer-joined', onJoin)
      socket.off('peer-left', onLeave)
      socket.off('signal', onSignal)
    }
  }, [])

  useEffect(() => {
    if (id && user) socket.emit('join-room', { roomId: id, nickname: user })
  }, [id, user])

  function handleSend() {
    const file = fileRef.current?.files?.[0]
    if (!file) return

    peers.forEach(id => sendFile(id, file))
    if (fileRef.current) fileRef.current.value = ''
  }

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

      <div>
        <h2>File Sharing</h2>
        <input type="file" ref={fileRef} className="mt-2" />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  )
}
