import { ChatUser } from '../../core/chat-user.core.model'

interface UserJoinRequest extends ChatUser {
  targetUserId: string
}

export { UserJoinRequest }
