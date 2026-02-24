import { handleDisconnect } from './handlers/disconnect'
import { handleJoinRoom } from './handlers/connection'
import { handleSignal } from './handlers/signal'
import { setupSocket } from './config/socket'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

const { io, server } = setupSocket(app)

io.on('connection', socket => {
  socket.on('join-room', handleJoinRoom(io, socket))
  socket.on('signal', handleSignal(io, socket))
  socket.on('disconnect', handleDisconnect(io, socket))
})

const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`)
})
