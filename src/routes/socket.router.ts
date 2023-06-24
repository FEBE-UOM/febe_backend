/* eslint-disable @typescript-eslint/require-array-sort-compare */
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { ChatEngine } from '../engines/chat.engine'

const socket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void => {
  io.on('connection', async (socket) => {
    socket.on('user-joined', async (data) => {
      return await ChatEngine.onUserJoined(data, socket, io)
    })

    socket.on('chat', async (data) => {
      return await ChatEngine.onChat(data, socket, io)
    })

    socket.on('disconnecting', async () => {
      await ChatEngine.onUserDisconnected(socket)
    })
  })
}

export { socket as socketRouter }
