import { Request, Response, Router } from 'express'
import { Users } from '../schemas/user.schema'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius, type } = req.query
    if (!latitude || !longitude || !radius || !type) {
      return res
        .status(400)
        .json({ message: 'latitude, longitude, type and radius is required' })
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
      type,
    })

    return res.json(nearByUsers)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

export { router as finderRouter }
