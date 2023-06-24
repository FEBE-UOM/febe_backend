interface User {
  name: string
  phoneNumber: string
  isSignupCompleted: boolean
  type: 'enabler' | 'entrepreneur' | 'enabler_and_entrepreneur'
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
  location?: {
    type?: String
    coordinates: Number[]
  }
  deviceToken: String
  createdAt: Date
  updatedAt: Date
}

export { User }
