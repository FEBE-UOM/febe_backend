import { Request, Response, Router } from 'express'
import { RoomPools } from '../schemas/room-pool.schema'
import { ChatEngine } from '../engines/chat.engine'
import { Users } from '../schemas/user.schema'
import { UserChat } from '../models/http/response/user-chat.response.model'
import { ChatMessages } from '../schemas/chat-message.schema'
import { ChatMessage } from '../models/db/chat-message.model'
import { User } from '../models/db/user.model'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const rooms = await RoomPools.find({
      targetUsers: { $in: [req.user?.id ?? ''] },
    })
      .sort('-updatedAt')
      .exec()

    const response: UserChat[] = []
    for (const room of rooms) {
      const [targetUserId] = room.targetUsers.filter(
        (x) => x.toString() !== req.user?.id
      )
      const targetUser = (await Users.findById(targetUserId)) as User

      const recentMessage = (await ChatMessages.findOne({
        roomId: room.roomId,
      })
        .sort('-createdAt')
        .exec()) as ChatMessage

      const unreadCount = await ChatMessages.find({
        $and: [
          { fromId: targetUserId },
          { toId: req.user?.id },
          { isRead: false },
        ],
      }).count()

      response.push({
        targetUser,
        recentMessage,
        unreadCount,
        room,
      })
    }

    return res.json(response)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.get('/:chatId/messages', async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId
    const expand = req.query.expand as unknown as boolean

    if (!chatId) {
      return res
        .status(400)
        .send({ message: 'chatId should be passed on the params' })
    }

    const chat = await RoomPools.findById(chatId)
    if (!chat) {
      return res.status(404).send({ message: 'chat not found found' })
    }

    const chats = await ChatEngine.getMessagesForChat(chat.roomId, expand)
    return res.json(chats)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.patch('/:chatId/read', async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId
    if (!chatId) {
      return res
        .status(400)
        .send({ message: 'chatId should be passed on the params' })
    }

    const chat = await RoomPools.findById(chatId)
    if (!chat) {
      return res.status(404).send({ message: 'chat not found found' })
    }

    const targetId = chat.targetUsers.find(
      (id) => id.toString() !== req.user?.id
    )

    return await ChatEngine.markMessagesAsRead(
      targetId ?? '',
      req.user?.id ?? ''
    )
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

export { router as chatRouter }
