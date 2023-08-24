import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWTPayload } from '../models/http/request/user-request.model'
import { Users } from '../schemas/user.schema'

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.get('Authorization') as string
    if (!authHeader) {
      return res.status(401).json({ message: 'authentication token missing' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'token missing' })
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
    const payload = jwt.verify(token, process.env.TOKEN_SECRET!) as JWTPayload
    if (!payload) {
      return res.status(401).json({ message: 'invalid access token' })
    }

    const user = await Users.findById(payload.id)
    if (!user) {
      return res.status(401).json({ message: 'user not found' })
    }

    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ message: 'invalid access token' })
  }
}

export { authenticateUser }
