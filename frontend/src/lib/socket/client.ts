import { io } from 'socket.io-client'

export const socketClient = io('http://localhost:4000', {
  autoConnect: false,
})

export function connectSocket() {
  if (!socketClient.connected) socketClient.connect()
}

export function disconnectSocket() {
  socketClient.disconnect()
}
