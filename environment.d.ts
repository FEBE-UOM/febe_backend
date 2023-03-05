declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_STRING: string
      NODE_ENV: 'development' | 'production'
      PORT?: string
      PWD: string
      TOKEN_SECRET: string
      TWILIO_ACCOUNT_SID: string
      TWILIO_AUTH_TOKEN: string
      TWILIO_PHONE_NUMBER: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
