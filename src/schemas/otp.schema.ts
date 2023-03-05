import mongoose from 'mongoose'
import { Otp } from '../models/db/otp.model'

const otpSchema = new mongoose.Schema(
  {
    phonenumber: {
      type: String,
      required: true,
      max: 10,
      min: 10,
    },
    code: {
      type: String,
      required: true,
      max: 6,
      min: 6,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Otps = mongoose.model<Otp>('otps', otpSchema)
export { Otps }
