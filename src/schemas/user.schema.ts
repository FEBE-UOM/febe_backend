import mongoose from 'mongoose'
import { User } from '../models/db/user.model'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      min: 6,
      max: 255,
    },
    phoneNumber: {
      type: String,
      required: true,
      max: 10,
      min: 10,
    },
    type: {
      type: String,
      required: true,
    },
    isSignupCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Users = mongoose.model<User>('users', userSchema)
export { Users }
