/* eslint-disable @typescript-eslint/no-base-to-string */
import { Request, Response, Router } from 'express'
import mongoose from 'mongoose'
import { Users } from '../schemas/user.schema'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius, type, userIdentity } = req.query
    if (!latitude || !longitude || !radius || !type || !userIdentity) {
      return res.status(400).json({
        message:
          'latitude, longitude, type, userIdentity and radius is required',
      })
    }

    const nearByUsers = await Users.find({
      location: {
        $near: {
          $maxDistance: radius,
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
      },
      _id: { $ne: req.user?.id },
      type,
      'enabler.designation':
        type === 'enabler'
          ? new mongoose.Types.ObjectId(userIdentity.toString())
          : undefined,
      'entrepreneur.industry':
        type === 'entrepreneur'
          ? new mongoose.Types.ObjectId(userIdentity.toString())
          : undefined,
    })

    return res.json(nearByUsers)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

export { router as finderRouter }
