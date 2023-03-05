import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import path from 'path'

import { userRouter } from './routes/user.route'
import { enablerCategoryRouter } from './routes/enabler_category.route'

config({ path: path.resolve(__dirname, '../.env') })

const app = express()
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/enabler-categories', enablerCategoryRouter)

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
mongoose
  .connect(process.env.DB_STRING)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to DB')
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error)
  })

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`)
})
