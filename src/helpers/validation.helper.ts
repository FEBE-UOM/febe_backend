import Joi from '@hapi/joi'
import { UserWithPassword } from '../models/db/user.model'
import { UserLoginRequest } from '../models/http/request/user-login.request.model'

// Register Validation
const validateUserRegistration = (
  data: UserWithPassword
): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    phoneNumber: Joi.string().required().min(10).max(10),
    password: Joi.string()
      .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)
      .error(() => {
        return new Error('')
      }),
  })

  return schema.validate(data)
}

// Login Validation
const validateUserLogin = (data: UserLoginRequest): Joi.ValidationResult => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  })

  return schema.validate(data)
}

export { validateUserRegistration, validateUserLogin }
