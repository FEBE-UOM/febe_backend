import mongoose from 'mongoose'
import { ChatMessage } from '../models/db/chat-message.model'

const chatMessageSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    toId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const ChatMessages = mongoose.model<ChatMessage>(
  'chatmessages',
  chatMessageSchema
)
export { ChatMessages }
