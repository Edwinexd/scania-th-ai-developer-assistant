import { useState } from 'react'
import { createConversation } from '../binding'

interface NewConversationFormProps {
  onConversationCreated: () => void
}

export function NewConversationForm({ onConversationCreated }: NewConversationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleNewConversation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create a conversation with an empty string as placeholder
      // The real interaction will happen in the ConversationScreen
      await createConversation("")
      onConversationCreated()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create conversation'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-b border-gray-700 p-4 bg-gray-800">
      <button
        onClick={handleNewConversation}
        disabled={isLoading}
        className={`w-full px-4 py-2 rounded-lg text-white ${
          isLoading
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isLoading ? 'Creating...' : 'New Conversation'}
      </button>
      {error && <p className="mt-2 text-red-400 text-sm">{error.message}</p>}
    </div>
  )
}
