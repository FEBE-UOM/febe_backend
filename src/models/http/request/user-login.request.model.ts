import { UserType } from '../../db/user.model'

interface UserLoginRequest {
  phonenumber: string
  type: UserType
}
export { UserLoginRequest }
