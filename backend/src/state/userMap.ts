const userToSocket = new Map<string, { socketId: string; roomId: string }>()

const socketToUser = new Map<string, string>()

const disconnectTimers = new Map<string, ReturnType<typeof setTimeout>>()

const GRACE_PERIOD_MS = 5_000

export function registerUser(userId: string, socketId: string, roomId: string) {
  cancelDisconnectTimer(userId)

  const existing = userToSocket.get(userId)
  if (existing) {
    socketToUser.delete(existing.socketId)
  }

  userToSocket.set(userId, { socketId, roomId })
  socketToUser.set(socketId, userId)
}

export function getUserIdBySocketId(socketId: string): string | undefined {
  return socketToUser.get(socketId)
}

export function getSocketIdByUserId(userId: string): string | undefined {
  return userToSocket.get(userId)?.socketId
}

export function getRoomIdByUserId(userId: string): string | undefined {
  return userToSocket.get(userId)?.roomId
}

export function isUserInRoom(userId: string, roomId: string): boolean {
  const entry = userToSocket.get(userId)
  return !!entry && entry.roomId === roomId
}

export function scheduleDisconnect(
  socketId: string,
  callback: (userId: string, roomId: string) => void,
) {
  const userId = socketToUser.get(socketId)
  if (!userId) return

  const entry = userToSocket.get(userId)
  if (!entry) return

  socketToUser.delete(socketId)

  const current = userToSocket.get(userId)
  if (current && current.socketId !== socketId) return

  const roomId = entry.roomId

  const timer = setTimeout(() => {
    disconnectTimers.delete(userId)

    const latest = userToSocket.get(userId)
    if (!latest || latest.socketId === socketId) {
      userToSocket.delete(userId)
      callback(userId, roomId)
    }
  }, GRACE_PERIOD_MS)

  disconnectTimers.set(userId, timer)
}

export function cancelDisconnectTimer(userId: string) {
  const timer = disconnectTimers.get(userId)
  if (timer) {
    clearTimeout(timer)
    disconnectTimers.delete(userId)
  }
}

export function getUsersInRoom(
  roomId: string,
  excludeUserId?: string,
): string[] {
  const users: string[] = []
  for (const [userId, entry] of userToSocket.entries()) {
    if (entry.roomId === roomId && userId !== excludeUserId) {
      users.push(userId)
    }
  }
  return users
}
