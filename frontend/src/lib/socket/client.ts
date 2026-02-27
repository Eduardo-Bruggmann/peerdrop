import { io } from 'socket.io-client'

export const socketClient = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  {
    autoConnect: false,
  },
)

socketClient.on('connect_error', error => {
  console.error('Socket connection error:', error)
})

socketClient.on('error', error => {
  console.error('Socket error:', error)
})

export function connectSocket() {
  if (!socketClient.connected) socketClient.connect()
}

export function disconnectSocket() {
  socketClient.disconnect()
}

/**
 * Returns a stable userId for this browser tab.
 * Persists across page reloads (sessionStorage) but is unique per tab.
 */
export function getUserId(): string {
  if (typeof window === 'undefined') return crypto.randomUUID()
  const existing = sessionStorage.getItem('peerdrop-user-id')
  if (existing) return existing
  const id = crypto.randomUUID()
  sessionStorage.setItem('peerdrop-user-id', id)
  return id
}
