import { socketClient, getUserId } from './client'
import type Peer from 'simple-peer'

export function setupSocketHandlers(
  onExisting: (ids: string[]) => void,
  onJoin: (id: string) => void,
  onLeave: (id: string) => void,
  onSignal: (data: { from: string; data: Peer.SignalData }) => void,
) {
  socketClient.on('existing-peers', onExisting)
  socketClient.on('peer-joined', onJoin)
  socketClient.on('peer-left', onLeave)
  socketClient.on('signal', onSignal)

  return () => {
    socketClient.off('existing-peers', onExisting)
    socketClient.off('peer-joined', onJoin)
    socketClient.off('peer-left', onLeave)
    socketClient.off('signal', onSignal)
  }
}

export function joinRoom(roomId: string, nickname: string) {
  socketClient.emit('join-room', { roomId, nickname, userId: getUserId() })
}
