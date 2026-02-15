'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!username.trim() || !room.trim()) return

    router.push(`/room/${room}?user=${encodeURIComponent(username)}`)
  }

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col gap-6 bg-blue-700 p-10 rounded-xl shadow-xl text-white min-w-85">
        <h1 className="text-3xl font-semibold text-center">
          Welcome to PeerDrop
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your nickname"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-md p-2 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="room">Room</label>
            <input
              id="room"
              type="text"
              value={room}
              onChange={e => setRoom(e.target.value)}
              placeholder="Enter room name"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-md p-2 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>

          <button
            type="submit"
            className="bg-white text-blue-700 font-semibold py-2 rounded-md hover:bg-white/80 transition-colors cursor-pointer"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  )
}
