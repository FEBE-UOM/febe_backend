interface ChatMessage {
  fromId: string
  toId: string
  text: string
  createdAt: Date
  updatedAt: Date
}

export { ChatMessage }
