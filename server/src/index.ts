import { Server } from 'socket.io'
import express from 'express'
import http from 'http'
import cors from 'cors'

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', socket => {
  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId)

    const peers = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
    const otherPeers = peers.filter(id => id !== socket.id)

    socket.emit('existing-peers', otherPeers)

    socket.to(roomId).emit('peer-joined', socket.id)
  })

  socket.on('signal', ({ to, data }) => {
    io.to(to).emit('signal', {
      from: socket.id,
      data,
    })
  })

  socket.on('disconnect', () => {
    socket.rooms.forEach(roomId => {
      if (roomId !== socket.id) {
        socket.to(roomId).emit('peer-left', socket.id)
      }
    })
  })
})

server.listen(4000, () => {
  console.log('Signaling server running on port 4000')
})
