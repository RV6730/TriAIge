import { io } from 'socket.io-client'

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io('/', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socket.on('connect', () => {
      console.log('[TriAIge] Socket connected:', socket.id)
    })
    socket.on('disconnect', () => {
      console.log('[TriAIge] Socket disconnected')
    })
    socket.on('connect_error', (err) => {
      console.warn('[TriAIge] Socket error:', err.message)
    })
  }
  return socket
}
