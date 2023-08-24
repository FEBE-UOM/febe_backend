interface ChatMessage {
  fromId: string
  toId: string
  text: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export { ChatMessage }
