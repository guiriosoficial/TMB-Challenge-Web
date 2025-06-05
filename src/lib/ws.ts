const baseUrl = process.env.WS_BASE_URL ?? 'ws://localhost:5022/ws'

const socket = new WebSocket(baseUrl)

export default socket
