import { createServer } from 'http'
import { Server } from 'socket.io'
import { Express } from 'express'

export function setupSocket(app: Express) {
  const server = createServer(app)

  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  })

  return { io, server }
}
