import { Socket } from 'socket.io'

export function handleDisconnect(socket: Socket) {
  return () => {
    socket.rooms.forEach(roomId => {
      if (roomId !== socket.id) {
        socket.to(roomId).emit('peer-left', socket.id)
      }
    })
  }
}
