import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import {
  validateUserLogin,
  validateUserVerifyOtp,
  validateUpdateUser,
  validateUserLocation,
} from '../helpers/validation.helper'
import { Users } from '../schemas/user.schema'
import { UserLoginRequest } from '../models/http/request/user-login.request.model'
import { Utils } from '../helpers/utils.helper'
import { Otps } from '../schemas/otp.schema'
import { UserVerifyOtpRequest } from '../models/http/request/user-verify-otp.request.model'
import { authenticateUser } from '../middlewares/authentication.middleware'
import { UpdateUserRequest } from '../models/http/request/update-user.request.model'
import { UpdateUserLocationRequest } from '../models/http/request/update-user-location.request.model'

const router = Router()

// Register
router.post('/login', async (req: Request, res: Response) => {
  try {
    const body = req.body as UserLoginRequest
    const { error } = validateUserLogin(body)

    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    let currentUser = await Users.findOne({
      phoneNumber: body.phonenumber,
    })

    if (!currentUser) {
      currentUser = new Users({
        phoneNumber: body.phonenumber,
        type: body.type,
      })
      await currentUser.save()
    }

    const code = Utils.generateOTP()
    const message = await Utils.sendSms(
      body.phonenumber,
      `Your OTP for FEBE login is: ${code.toString()}`
    )

    const otp = new Otps({
      code,
      expiresAt: Date.now() + 60 * 1000,
      isActive: true,
      phonenumber: body.phonenumber,
    })
    await otp.save()
    return res.status(200).json({
      messageId: message.sid,
    })
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

// Verify OTP
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const body = req.body as UserVerifyOtpRequest
    const { error } = validateUserVerifyOtp(body)

    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    const otpDetails = await Otps.findOne({
      phonenumber: body.phonenumber,
      code: body.otp,
      isActive: true,
    })

    if (!otpDetails) {
      return res.status(400).send({ message: 'invalid otp' })
    }

    if (otpDetails.expiresAt.getTime() < Date.now()) {
      return res.status(400).send({ message: 'otp expired' })
    }

    otpDetails.isActive = false
    await otpDetails.save()

    const currentUser = await Users.findOne({ phoneNumber: body.phonenumber })
    if (!currentUser) {
      return res.status(400).send({ message: 'user not found' })
    }

    // Create and assign a token
    const token = jwt.sign(
      {
        id: currentUser._id,
      },
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
      process.env.TOKEN_SECRET!
    )
    return res.send({ 'auth-token': token })
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.put('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const body = req.body as UpdateUserRequest
    const { error } = validateUpdateUser(body)

    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    let user = await Users.findById(req.user?.id)
    if (!user) {
      return res.status(400).send({ message: 'user not found' })
    }

    await Users.updateOne(
      { _id: req.user?.id },
      { ...body, ...{ isSignupCompleted: true } }
    )
    user = await Users.findById(req.user?.id)
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.put(
  '/location',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const body = req.body as UpdateUserLocationRequest
      const { error } = validateUserLocation(body)

      if (error) {
        return res.status(400).send({ message: error.details[0].message })
      }

      const user = await Users.findById(req.user?.id)
      if (!user) {
        return res.status(400).send({ message: 'user not found' })
      }

      user.location = {
        coordinates: [body.longitude, body.latitude],
      }
      await user.save()
      return res.status(200).json(body)
    } catch (error) {
      return res.status(500).send({ message: (error as Error).message })
    }
  }
)

router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { expand } = req.query
    let user = await Users.findById(req.user?.id)

    if (expand) {
      user = await Users.findById(req.user?.id, { strictPopulate: false })
        .populate('enabler.designation')
        .populate('entrepreneur.industry')
    }

    if (!user) {
      return res.status(400).send({ message: 'user not found' })
    }

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

export { router as userRouter }
