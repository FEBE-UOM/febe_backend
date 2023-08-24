import TwilioSDK from 'twilio'
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message'

const accountSid =
  process.env.TWILIO_ACCOUNT_SID ?? 'AC763d28faffc836c8807f018c3d6a08cd'
const authToken =
  process.env.TWILIO_AUTH_TOKEN ?? '524f8524ef0a002315236c321b663d82'
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER ?? '+12708187540'

const client = TwilioSDK(accountSid, authToken)

class Utils {
  static generateOTP = (): string => {
    // Declare a digits variable
    // which stores all digits
    const NUMBER_OF_DIGITS = 4
    const digits = '0123456789'
    let OTP = ''
    for (let i = 0; i < NUMBER_OF_DIGITS; i++) {
      OTP += digits[Math.floor(Math.random() * 10)]
    }
    return OTP
  }

  static sendSms = async (
    to: string,
    body: string
  ): Promise<MessageInstance> => {
    const message = await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to,
    })
    return message
  }
}

export { Utils }
