import { Server, Socket } from 'socket.io'
import { registerUser, isUserInRoom, getUsersInRoom } from '../state/userMap'

export function handleJoinRoom(io: Server, socket: Socket) {
  return ({ roomId, userId }: { roomId: string; userId: string }) => {
    const alreadyInRoom = isUserInRoom(userId, roomId)

    registerUser(userId, socket.id, roomId)
    socket.join(roomId)

    const otherUsers = getUsersInRoom(roomId, userId)
    socket.emit('existing-peers', otherUsers)

    if (!alreadyInRoom) {
      socket.to(roomId).emit('peer-joined', userId)
    }
  }
}
