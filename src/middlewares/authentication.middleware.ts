import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Users } from '../schemas/user.schema'

interface JWTPayload {
  _id: string
  type: string
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  try {
    const authHeader = req.headers.Authorisation as string
    if (!authHeader) {
      return res.status(401).json({ message: 'authentication token missing' })
    }

    const token = authHeader.split('Bearer ')[0]
    if (!token) {
      return res.status(401).json({ message: 'authentication token missing' })
    }

    const payload = jwt.verify(token, process.env.TOKEN_SECRET) as JWTPayload
    if (!payload) {
      return res.status(401).json({ message: 'invalid access token' })
    }

    const user = await Users.findById(payload._id)
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
