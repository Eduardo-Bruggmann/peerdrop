import { Server, Socket } from 'socket.io'

export function handleJoinRoom(io: Server, socket: Socket) {
  return ({ roomId }: { roomId: string }) => {
    socket.join(roomId)

    const peers = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
    const otherPeers = peers.filter(id => id !== socket.id)

    socket.emit('existing-peers', otherPeers)
    socket.to(roomId).emit('peer-joined', socket.id)
  }
}
