import { useState, useEffect } from "react"
import type { Conversation, Message } from "../binding"
import { fetchConversation, sendMessage } from "../binding"

interface ConversationDetailsProps {
  conversation: Conversation
  onRefresh: () => void
}

export function ConversationDetails({ conversation, onRefresh }: ConversationDetailsProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchConversation(conversation.id)
        setMessages(data.messages)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load conversation"))
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [conversation.id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    setError(null)

    try {
      const message = await sendMessage(conversation.id, newMessage.trim())
      setMessages(prev => [...prev, message])
      setNewMessage("")
      onRefresh() // Refresh conversation list to update titles
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to send message"))
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error.message}</p>
        <button 
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
          onClick={() => setError(null)}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          {conversation.title || `Conversation ${conversation.id}`}
        </h1>
        
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No messages yet</div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="border border-gray-200 rounded-lg shadow-sm">
                <div className="bg-gray-100 p-3 rounded-t-lg border-b">
                  <div className="font-semibold">User:</div>
                  <div className="whitespace-pre-wrap">{message.query}</div>
                </div>
                <div className="p-3">
                  <div className="font-semibold">AI:</div>
                  <div className="whitespace-pre-wrap">{message.response || "Processing..."}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className={`px-4 py-2 rounded-r-lg text-white ${
              !newMessage.trim() || isSending
                ? "bg-indigo-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  )
}
