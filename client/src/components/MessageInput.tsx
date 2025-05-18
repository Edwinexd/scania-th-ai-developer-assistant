import { useState } from "react"
import { Button } from "./Button"

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>
  placeholder?: string
  initialValue?: string
  buttonText?: string
  loadingText?: string
}

export function MessageInput({
  onSendMessage,
  placeholder = "Type your message...",
  initialValue = "",
  buttonText = "Send",
  loadingText = "Sending...",
}: MessageInputProps) {
  const [message, setMessage] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      await onSendMessage(message.trim())
      setMessage("")
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to send message"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-4">
        {error && <div className="text-red-500 text-sm">{error.message}</div>}
        <div className="flex shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 focus:outline-none text-gray-700"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="rounded-l-none"
          >
            {isLoading ? loadingText : buttonText}
          </Button>
        </div>
      </div>
    </form>
  )
}
