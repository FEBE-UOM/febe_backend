import mongoose from 'mongoose'
import { User } from '../models/db/user.model'

const aadharSchema = new mongoose.Schema({
  front: {
    type: String,
  },
  back: {
    type: String,
  },
})

const companyRegistrationSchema = new mongoose.Schema({
  url: {
    type: String,
  },
})

const enablerSchema = new mongoose.Schema({
  about: {
    type: String,
    required: true,
  },
  linkedInURL: {
    type: String,
    required: true,
  },
  portfolioURL: {
    type: String,
  },
  aadhar: {
    type: aadharSchema,
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'enabler_designation',
  },
})

const entrepreneur = new mongoose.Schema({
  about: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  websiteURL: {
    type: String,
    required: true,
  },
  linkedInURL: {
    type: String,
    required: true,
  },
  companyRegistrationDocument: {
    type: companyRegistrationSchema,
    required: false,
  },
})

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
    dateOfBirth: { type: Date },
    enabler: {
      type: enablerSchema,
      required: false,
    },
    entrepreneur: {
      type: entrepreneur,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

const Users = mongoose.model<User>('users', userSchema)
export { Users }
