type UserType = 'enabler' | 'entrepreneur'

interface User {
  name: string
  phoneNumber: string
  type: UserType
  isSignupCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export { User, UserType }
