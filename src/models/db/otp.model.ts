interface Otp {
  phonenumber: string
  code: string
  expiresAt: Date
  isActive: boolean
}

export { Otp }
