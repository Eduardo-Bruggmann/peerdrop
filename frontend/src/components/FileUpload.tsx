'use client'

import { sendFile } from '@/lib/webrtc/fileTransfer'
import { useRef } from 'react'

interface FileUploadProps {
  peers: string[]
}

export default function FileUpload({ peers }: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleSend() {
    const file = fileRef.current?.files?.[0]
    if (!file) return

    peers.forEach(id => sendFile(id, file))
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      <h2 className="font-semibold mb-2">File Sharing</h2>
      <input type="file" ref={fileRef} className="mt-2" />
      <button
        onClick={handleSend}
        className="ml-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
      >
        Send
      </button>
    </div>
  )
}
