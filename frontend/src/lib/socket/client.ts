import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

export const socketClient = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  {
    autoConnect: false,
  },
)

export function connectSocket() {
  if (!socketClient.connected) socketClient.connect()
}

export function disconnectSocket() {
  socketClient.disconnect()
}

export function getUserId(): string {
  if (typeof window === 'undefined') return uuidv4()
  const existing = sessionStorage.getItem('peerdrop-user-id')
  if (existing) return existing
  const id = uuidv4()
  sessionStorage.setItem('peerdrop-user-id', id)
  return id
}
