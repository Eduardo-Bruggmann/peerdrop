import { Server, Socket } from 'socket.io'

export function handleSignal(io: Server, socket: Socket) {
  return ({ to, data }: { to: string; data: any }) => {
    io.to(to).emit('signal', {
      from: socket.id,
      data,
    })
  }
}
