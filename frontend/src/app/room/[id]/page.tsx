'use client'

import FileUpload from '@/components/FileUpload'
import PeersList from '@/components/PeersList'
import { useRoom } from '@/hooks/useRoom'

export default function Room() {
  const { peers, roomId, user } = useRoom()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold text-center">
        Room: {roomId} — User: {user}
      </h1>

      <PeersList peers={peers} />
      <FileUpload peers={peers} />
    </div>
  )
}
