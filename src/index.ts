import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'
import { Server } from 'socket.io'
import { createServer } from 'http'

import { userRouter } from './routes/user.route'
import { enablerCategoryRouter } from './routes/enabler_category.route'
import { entrepreneurIndustryRouter } from './routes/entrepreneur_industry.route'
import { finderRouter } from './routes/finder.route'
import { authenticateUser } from './middlewares/authentication.middleware'
import { fileRouter } from './routes/file.router'
import { socketRouter } from './routes/socket.router'
import { FirebaseUtils } from './helpers/firebase.helper'
import { PushNotification } from './helpers/push-notification.helper'
import { chatRouter } from './routes/chat.router'

config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const server = createServer(app)
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/enabler-categories', enablerCategoryRouter)
app.use('/api/entrepreneur-industry', entrepreneurIndustryRouter)
app.use('/api/finder', authenticateUser, finderRouter)
app.use('/api/chats', authenticateUser, chatRouter)
app.use('/api/files', fileRouter)

app.post('/notify', async () => {
  await PushNotification.send('', 'This is a title', 'This is a message')
})

const dir = '../resources/static/assets/uploads'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

FirebaseUtils.init()

mongoose
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
  .connect(process.env.DB_STRING!)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to DB')
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error)
  })

const io = new Server(server)
socketRouter(io)

const PORT = process.env.PORT ?? 3000
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`)
})
