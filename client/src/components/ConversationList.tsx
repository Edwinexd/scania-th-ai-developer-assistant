import type { Conversation } from "../binding"

interface ConversationListProps {
  conversations: Conversation[]
  isLoading: boolean
  error: Error | null
  onSelect: (conversation: Conversation) => void
  onDelete: (id: number) => void
  selectedId?: number
}

export function ConversationList({
  conversations,
  isLoading,
  error,
  onSelect,
  onDelete,
  selectedId
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error.message}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No conversations yet
      </div>
    )
  }

  return (
    <div className="overflow-y-auto">
      <ul className="space-y-1">
        {conversations.map((conversation) => (
          <li 
            key={conversation.id} 
            className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-700 ${
              selectedId === conversation.id ? "bg-gray-700" : ""
            }`}
            onClick={() => onSelect(conversation)}
          >
            <span className="truncate flex-1">
              {conversation.title || `Conversation ${conversation.id}`}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onDelete(conversation.id)
              }}
              className="text-gray-400 hover:text-red-500"
              aria-label="Delete conversation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
