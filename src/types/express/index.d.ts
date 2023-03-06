import { JWTPayload } from '../../models/http/user-request.model'

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      language?: Language
      user?: JWTPayload
    }
  }
}
