import { Server, Socket } from 'socket.io'
import { getUserIdBySocketId, getSocketIdByUserId } from '../state/userMap'

export function handleSignal(io: Server, socket: Socket) {
  return ({ to, data }: { to: string; data: any }) => {
    const targetSocketId = getSocketIdByUserId(to)

    const fromUserId = getUserIdBySocketId(socket.id)

    if (targetSocketId && fromUserId) {
      io.to(targetSocketId).emit('signal', {
        from: fromUserId,
        data,
      })
    }
  }
}
