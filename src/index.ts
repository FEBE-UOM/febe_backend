import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import { userRouter } from './routes/user.route'

const app = express()
app.use(express.json())

dotenv.config()

app.use('/api/users', userRouter)

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
mongoose.connect(process.env.DB_STRING!, () => {
  // eslint-disable-next-line no-console
  console.log('Connected to DB')
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`)
})
