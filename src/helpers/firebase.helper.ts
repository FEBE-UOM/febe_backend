import { App, ServiceAccount, cert, initializeApp } from 'firebase-admin/app'
import { getMessaging, Messaging } from 'firebase-admin/messaging'
import FirebaseConfig from '../google-services.json'

class FirebaseUtils {
  static app: App

  static init = (): void => {
    this.app = initializeApp({
      credential: cert(FirebaseConfig as ServiceAccount),
    })
  }

  static getMessaging = (): Messaging => {
    return getMessaging(this.app)
  }
}

export { FirebaseUtils }
