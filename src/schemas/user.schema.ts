import mongoose from 'mongoose'
import { User } from '../models/db/user.model'

const geoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point',
  },
  coordinates: {
    type: [Number],
  },
})

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'entrepreneur_industry',
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
    type: {
      type: String,
      enum: ['enabler', 'entrepreneur', 'enabler_and_entrepreneur'],
    },
    phoneNumber: {
      type: String,
      required: true,
      max: 10,
      min: 10,
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
    location: {
      type: geoSchema,
      index: '2dsphere',
    },
    deviceToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Users = mongoose.model<User>('users', userSchema)
export { Users }
