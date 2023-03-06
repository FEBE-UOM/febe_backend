interface User {
  name: string
  phoneNumber: string
  isSignupCompleted: boolean
  enabler?: {
    about?: String
    linkedInURL?: String
    portfolioURL?: String
    aadhar?: {
      front: String
      back: String
    }
    designation: String
  }
  entrepreneur?: {
    about?: String
    industry?: String
    companyName?: String
    websiteURL?: String
    linkedInURL?: String
    companyRegistrationDocument?: {
      url?: String
    }
  }
  createdAt: Date
  updatedAt: Date
}

export { User }
