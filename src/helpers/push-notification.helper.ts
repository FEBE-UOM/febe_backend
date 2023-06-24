import { TokenMessage } from 'firebase-admin/messaging'
import { Users } from '../schemas/user.schema'
import { FirebaseUtils } from './firebase.helper'

/* eslint-disable @typescript-eslint/promise-function-async */
class PushNotification {
  static send = async (
    userId: string,
    title: string,
    message: string
  ): Promise<string> => {
    const user = await Users.findById(userId)
    if (!user) {
      throw Error('user not found')
    }

    const body: TokenMessage = {
      notification: {
        body: message,
        title,
      },
      token: user.deviceToken.toString(),
    }

    const messaging = FirebaseUtils.getMessaging()
    return await messaging.send(body)
  }
}

export { PushNotification }
