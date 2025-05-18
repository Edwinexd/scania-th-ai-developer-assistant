import { useState } from "react"
import { sendMessage } from "../binding"
import type { Conversation, Message } from "../binding"

interface ConversationScreenProps {
  conversation: Conversation
  messages: Message[]
  onNewMessage: (message: Message) => void
}

export function ConversationScreen({ conversation, messages, onNewMessage }: ConversationScreenProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const message = await sendMessage(conversation.id, query)
      onNewMessage(message)
      setQuery("")
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to send message"))
    } finally {
      setIsLoading(false)
    }
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

      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`px-4 py-2 rounded-r-lg text-white ${
              !query.trim() || isLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
        {error && <p className="mt-2 text-red-500 text-sm">{error.message}</p>}
      </div>
    </div>
  )
}
