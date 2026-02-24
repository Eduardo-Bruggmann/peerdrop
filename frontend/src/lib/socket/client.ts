import { io } from 'socket.io-client'

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
