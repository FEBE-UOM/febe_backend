/* eslint-disable @typescript-eslint/no-base-to-string */
import { Request, Response, Router } from 'express'
import mongoose from 'mongoose'
import { Users } from '../schemas/user.schema'
import { RoomPools } from '../schemas/room-pool.schema'

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

    const nearByUsersWithRoom = []
    for (const user of nearByUsers) {
      const room = await RoomPools.findOne({
        $and: [
          { targetUsers: { $in: [req.user?.id ?? ''] } },
          { targetUsers: { $in: [user?._id ?? ''] } },
        ],
      })
        .sort('-updatedAt')
        .exec()

      nearByUsersWithRoom.push({
        user,
        room,
      })
    }

    return res.json(nearByUsersWithRoom)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

export { router as finderRouter }
