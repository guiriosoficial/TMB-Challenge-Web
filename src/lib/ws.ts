const baseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL ?? 'ws://localhost:5000/ws'

const socket = new WebSocket(baseUrl)

export default socket
