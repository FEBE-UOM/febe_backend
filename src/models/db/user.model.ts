interface User {
  name: string
  email: string
  phoneNumber: string
  createdAt: Date
  updatedAt: Date
}

interface UserWithPassword extends User {
  password: string
}

export { User, UserWithPassword }
