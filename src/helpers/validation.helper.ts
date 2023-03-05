import Joi from '@hapi/joi'
import { EnablerCategoryRequest } from '../models/http/request/create-enabler-category.request.model'
import { EnablerDesignationRequest } from '../models/http/request/enabler-designation.request.model'
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

export {
  validateUserLogin,
  validateUserVerifyOtp,
  validateEnablerCategory,
  validateEnablerDesignation,
}
