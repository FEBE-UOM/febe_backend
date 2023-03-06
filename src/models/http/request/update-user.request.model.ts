interface UpdateUserRequest {
  name?: String
  dateOfBirth?: Date
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
}

export { UpdateUserRequest }
