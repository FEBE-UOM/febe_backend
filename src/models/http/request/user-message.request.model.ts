import { UserJoinRequest } from './user-join.request.model'

interface UserMessageRequest extends UserJoinRequest {
  message: string
}

export { UserMessageRequest }
