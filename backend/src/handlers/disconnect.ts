import { Server, Socket } from 'socket.io'
import { scheduleDisconnect } from '../state/userMap'

export function handleDisconnect(io: Server, socket: Socket) {
  return () => {
    scheduleDisconnect(socket.id, (userId, roomId) => {
      io.to(roomId).emit('peer-left', userId)
    })
  }
}
