import { ChatMessage } from '../../db/chat-message.model'
import { RoomPool } from '../../db/room-pool.db.model'
import { User } from '../../db/user.model'

interface UserChat {
  targetUser: User
  recentMessage: ChatMessage
  room: RoomPool
  unreadCount: number
}

export { UserChat }
