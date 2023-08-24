import Joi from '@hapi/joi'
import { EntrepreneurIndustry } from '../models/db/entrepreneur_industry.model'
import { EnablerCategoryRequest } from '../models/http/request/create-enabler-category.request.model'
import { EnablerDesignationRequest } from '../models/http/request/enabler-designation.request.model'
import { UpdateUserLocationRequest } from '../models/http/request/update-user-location.request.model'
import { UpdateUserRequest } from '../models/http/request/update-user.request.model'
import { UserLoginRequest } from '../models/http/request/user-login.request.model'
import { UserVerifyOtpRequest } from '../models/http/request/user-verify-otp.request.model'

// Login Validation
const validateUserLogin = (data: UserLoginRequest): Joi.ValidationResult => {
  const schema = Joi.object({
    phonenumber: Joi.string().min(10).max(13).required(),
    type: Joi.string(),
  })

  return schema.validate(data)
}

const validateUserVerifyOtp = (
  data: UserVerifyOtpRequest
): Joi.ValidationResult => {
  const schema = Joi.object({
    phonenumber: Joi.string().min(10).max(13).required(),
    otp: Joi.string().min(4).max(6).required(),
  })

  return schema.validate(data)
}

const validateEnablerCategory = (
  data: EnablerCategoryRequest
): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  })

  return schema.validate(data)
}

const validateEnablerDesignation = (
  data: EnablerDesignationRequest
): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  })

  return schema.validate(data)
}

const validateEntrepreneurIndustry = (
  data: EntrepreneurIndustry
): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  })

  return schema.validate(data)
}

const validateUpdateUser = (data: UpdateUserRequest): Joi.ValidationResult => {
  const enablerSchema = Joi.object({
    about: Joi.string(),
    linkedInURL: Joi.string(),
    portfolioURL: Joi.string(),
    aadhar: {
      front: Joi.string(),
      back: Joi.string(),
    },
    designation: Joi.string(),
  })

  const entrepreneurSchema = Joi.object({
    about: Joi.string(),
    industry: Joi.string(),
    companyName: Joi.string(),
    websiteURL: Joi.string(),
    linkedInURL: Joi.string(),
    companyRegistrationDocument: {
      url: Joi.string(),
    },
  })

  const schema = Joi.object({
    name: Joi.string(),
    dateOfBirth: Joi.date(),
    enabler: enablerSchema,
    entrepreneur: entrepreneurSchema,
    deviceToken: Joi.string(),
  })

  return schema.validate(data)
}

const validateUserLocation = (
  data: UpdateUserLocationRequest
): Joi.ValidationResult => {
  const schema = Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  })

  return schema.validate(data)
}

export {
  validateUserLogin,
  validateUserVerifyOtp,
  validateEnablerCategory,
  validateEnablerDesignation,
  validateEntrepreneurIndustry,
  validateUpdateUser,
  validateUserLocation,
}
