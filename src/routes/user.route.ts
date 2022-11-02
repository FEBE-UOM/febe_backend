import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  validateUserLogin,
  validateUserRegistration,
} from '../helpers/validation.helper'
import { Users } from '../schemas/user.schema'
import { UserWithPassword } from '../models/db/user.model'
import { UserLoginRequest } from '../models/http/request/user-login.request.model'
const router = Router()

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const body = req.body as UserWithPassword
    const { error } = validateUserRegistration(body)

    if (error) {
      try {
        return res.status(400).send({ message: error.details[0].message })
      } catch (err) {
        return res.status(400).send({
          message:
            'Password of minimum length 6, must contain atleast 1 special character, 1 lowercase letter, 1 uppercase letter and 1 number',
        })
      }
    }

    const emailExists = await Users.findOne({ email: body.email })
    if (emailExists != null) {
      return res.status(400).send({ message: 'email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(body.password, salt)

    const user = new Users({
      name: body.name,
      email: body.email,
      password: hashPassword,
      phoneNumber: body.phoneNumber,
    })

    const savedUser = await user.save()
    res.send({ user: savedUser._id })
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const body = req.body as UserLoginRequest
    const { error } = validateUserLogin(body)
    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    const user = await Users.findOne({ email: body.email })
    if (!user) {
      return res.status(400).send({ message: "email doesn't exists" })
    }

    const validPassword = await bcrypt.compare(body.password, user.password)
    if (!validPassword) {
      return res.status(400).send({ message: 'Invalid password' })
    }

    // Create and assign a token
    const token = jwt.sign(
      {
        id: user._id,
      },
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
      process.env.TOKEN_SECRET!
    )

    return res.send({ 'auth-token': token })
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

export { router as userRouter }
