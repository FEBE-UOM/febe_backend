import Joi from '@hapi/joi'
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

export { validateUserLogin, validateUserVerifyOtp }
