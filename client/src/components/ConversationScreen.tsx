import type { Conversation, Message } from "../binding"
import { sendMessage } from "../binding"
import { MessageInput } from "./MessageInput"

interface ConversationScreenProps {
  conversation: Conversation
  messages: Message[]
  onNewMessage: (message: Message) => void
}

export function ConversationScreen({ conversation, messages, onNewMessage }: ConversationScreenProps) {
  const handleSendMessage = async (messageText: string) => {
    const message = await sendMessage(conversation.id, messageText)
    onNewMessage(message)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className="bg-blue-100 rounded-lg p-3">
              <p className="font-medium">You:</p>
              <p>{message.query}</p>
            </div>
            {message.response && (
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-medium">Assistant:</p>
                <p>{message.response}</p>
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-gray-500">
            Start a conversation by sending a message below.
          </div>
        )}
      </div>
      
      <div className="p-6 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <MessageInput 
            onSendMessage={handleSendMessage}
            placeholder="Type your message..."
          />
        </div>
      </div>
    </div>
  )
}
