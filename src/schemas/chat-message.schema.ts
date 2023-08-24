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
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'room_pools',
    },
    text: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const ChatMessages = mongoose.model<ChatMessage>(
  'chat_messages',
  chatMessageSchema
)
export { ChatMessages }
