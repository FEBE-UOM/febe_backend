import { Socket, Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { ChatUser } from '../models/core/chat-user.core.model'
import { RoomPool } from '../models/core/room-pool.core.model'
import { UserJoinRequest } from '../models/http/request/user-join.request.model'
import { v4 as uuidv4 } from 'uuid'
import { UserMessageRequest } from '../models/http/request/user-message.request.model'
import { ChatMessages } from '../schemas/chat-message.schema'
import { PushNotification } from '../helpers/push-notification.helper'
import { ChatMessage } from '../models/db/chat-message.model'

class ChatEngine {
  static rooms: RoomPool[] = []
  static users: ChatUser[] = []

  static onUserJoined = async (
    data: UserJoinRequest,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ): Promise<void> => {
    let user = this.users.find((x) => x.userId === data.userId)
    if (!user) {
      user = {
        userId: data.userId,
        name: data.name,
        socketId: socket.id,
      }
      this.users.push(user)
    }
    user.socketId = socket.id

    let currentRoom = this.rooms.find(
      (x) =>
        JSON.stringify(x.targetUsers.sort()) ===
        JSON.stringify([data.userId, data.targetUserId].sort())
    )

    if (!currentRoom) {
      currentRoom = {
        roomId: uuidv4().toString(),
        targetUsers: [data.userId, data.targetUserId],
        activeUsers: [data.userId],
      }
      this.rooms.push(currentRoom)
    }

    if (!currentRoom.activeUsers.includes(data.userId)) {
      currentRoom.activeUsers.push(user.userId)
    }

    await socket.join(currentRoom.roomId)

    const messages = await this.getMessagesForChat(data)
    io.to(currentRoom.roomId).emit('user-joined', messages)
  }

  static onChat = async (
    data: UserMessageRequest,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ): Promise<void> => {
    let currentRoom = this.rooms.find(
      (x) =>
        JSON.stringify(x.targetUsers.sort()) ===
        JSON.stringify([data.userId, data.targetUserId].sort())
    )

    if (!currentRoom) {
      currentRoom = {
        roomId: uuidv4().toString(),
        targetUsers: [data.userId, data.targetUserId],
        activeUsers: [data.userId],
      }
      this.rooms.push(currentRoom)
    }

    if (!currentRoom.activeUsers.includes(data.targetUserId)) {
      await this.storeMessageInDB(data)
      await this.sendPushNotification(data)
      return
    }
    io.to(currentRoom.roomId).emit('chat', {
      username: data.userId,
      message: data.message,
    })

    await this.storeMessageInDB(data)
  }

  static onUserDisconnected = async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ): Promise<void> => {
    const username = this.users.find((x) => x.socketId === socket.id)?.userId
    if (!username) {
      return
    }

    const currentRoom = this.rooms.find((x) => x.activeUsers.includes(username))
    if (!currentRoom) {
      return
    }

    currentRoom.activeUsers = currentRoom?.activeUsers.filter(
      (x) => x !== username
    )
  }

  private static readonly storeMessageInDB = async (
    data: UserMessageRequest
  ): Promise<void> => {
    const newMessage = new ChatMessages({
      fromId: data.userId,
      toId: data.targetUserId,
      text: data.message,
    })

    await newMessage.save()
  }

  private static readonly sendPushNotification = async (
    data: UserMessageRequest
  ): Promise<string> => {
    return await PushNotification.send(
      data.targetUserId,
      data.message,
      'You got a new message'
    )
  }

  private static readonly getMessagesForChat = async (
    data: UserJoinRequest
  ): Promise<ChatMessage[]> => {
    const messages = await ChatMessages.find({
      $or: [
        { $and: [{ fromId: data.userId }, { toId: data.targetUserId }] },
        { $and: [{ fromId: data.targetUserId }, { toId: data.userId }] },
      ],
    })
    return messages
  }
}

export { ChatEngine }
