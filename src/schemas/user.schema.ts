import mongoose from 'mongoose'
import { UserWithPassword } from '../models/db/user.model'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      max: 255,
      min: 6,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
    phoneNumber: {
      type: String,
      required: true,
      max: 10,
      min: 10,
    },
  },
  {
    timestamps: true,
  }
)

const Users = mongoose.model<UserWithPassword>('users', userSchema)
export { Users }
