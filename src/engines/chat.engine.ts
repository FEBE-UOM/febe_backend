import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { PushNotification } from '../helpers/push-notification.helper'
import { ChatUser } from '../models/core/chat-user.core.model'
import { ChatMessage } from '../models/db/chat-message.model'
import { UserJoinRequest } from '../models/http/request/user-join.request.model'
import { UserMessageRequest } from '../models/http/request/user-message.request.model'
import { ChatMessages } from '../schemas/chat-message.schema'
import { RoomPools } from '../schemas/room-pool.schema'

class ChatEngine {
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
        socketId: socket.id,
      }
      this.users.push(user)
    }
    user.socketId = socket.id

    let currentRoom = await RoomPools.findOne({
      targetUsers: { $all: [data.userId, data.targetUserId] },
    })

    if (!currentRoom) {
      currentRoom = new RoomPools({
        targetUsers: [data.userId, data.targetUserId],
        activeUsers: [data.userId],
      })
      await currentRoom.save()
    }

    if (!currentRoom.activeUsers.includes(data.userId)) {
      currentRoom.activeUsers.push(user.userId)
      await currentRoom.save()
    }

    await socket.join(currentRoom.roomId)

    await this.markMessagesAsRead(data.targetUserId, data.userId)
    const messages = await this.getMessagesForChat(currentRoom.roomId)
    io.to(currentRoom.roomId).emit('user-joined', messages)
  }

  static onChat = async (
    data: UserMessageRequest,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ): Promise<void> => {
    let currentRoom = await RoomPools.findOne({
      targetUsers: { $all: [data.userId, data.targetUserId] },
    })

    if (!currentRoom) {
      currentRoom = new RoomPools({
        targetUsers: [data.userId, data.targetUserId],
        activeUsers: [data.userId],
      })
      await currentRoom.save()
    }

    if (!currentRoom.activeUsers.includes(data.targetUserId)) {
      await this.storeMessageInDB(data, currentRoom.roomId)
      await this.sendPushNotification(data)
      return
    }

    io.to(currentRoom.roomId).emit('chat', {
      username: data.userId,
      message: data.message,
    })

    await this.storeMessageInDB(data, currentRoom.roomId)
  }

  static onUserDisconnected = async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ): Promise<void> => {
    const username = this.users.find((x) => x.socketId === socket.id)?.userId
    if (!username) {
      return
    }

    const currentRoom = await RoomPools.findOne({
      activeUsers: { $in: [username] },
    })
    if (!currentRoom) {
      return
    }

    currentRoom.activeUsers = currentRoom?.activeUsers.filter(
      (x) => x.toString() !== username
    )

    await currentRoom.save()
  }

  private static readonly storeMessageInDB = async (
    data: UserMessageRequest,
    roomId: string
  ): Promise<void> => {
    const newMessage = new ChatMessages({
      fromId: data.userId,
      toId: data.targetUserId,
      text: data.message,
      roomId,
    })

    await newMessage.save()
  }

  private static readonly sendPushNotification = async (
    data: UserMessageRequest
  ): Promise<string | undefined> => {
    try {
      return await PushNotification.send(
        data.targetUserId,
        data.message,
        'You got a new message'
      )
    } catch (error) {}
  }

  public static readonly getMessagesForChat = async (
    roomId: string,
    populate?: boolean
  ): Promise<ChatMessage[]> => {
    if (populate) {
      return await ChatMessages.find({
        roomId,
      })
        .populate('fromId')
        .populate('toId')
        .populate('roomId')
        .sort('-createdAt')
        .exec()
    }

    return await ChatMessages.find({
      roomId,
    })
      .sort('-createdAt')
      .exec()
  }

  public static readonly markMessagesAsRead = async (
    fromId: string,
    toId: string
  ): Promise<any> => {
    const response = await ChatMessages.updateMany(
      {
        $and: [{ fromId }, { toId }, { isRead: false }],
      },
      { isRead: true }
    )
    return response
  }
}

export { ChatEngine }
