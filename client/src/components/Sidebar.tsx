import type { Conversation } from '../binding'
import { ConversationList } from './ConversationList'
import { useConversations } from '../hooks/useConversations'

interface SidebarProps {
  onSelectConversation: (conversation: Conversation) => void
  selectedConversationId?: number
  onNewConversation: () => void
}

export function Sidebar({ 
  onSelectConversation, 
  selectedConversationId, 
  onNewConversation 
}: SidebarProps) {
  const { 
    conversations, 
    isLoading, 
    error, 
    deleteConversation 
  } = useConversations()

  return (
    <div className="h-screen bg-gray-800 text-white w-64 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Conversations</h2>
      </div>
      
      <div className="border-b border-gray-700 p-4 bg-gray-800">
        <button
          onClick={onNewConversation}
          className="w-full px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
        >
          New Conversation
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ConversationList
          conversations={conversations}
          isLoading={isLoading}
          error={error}
          onSelect={onSelectConversation}
          onDelete={deleteConversation}
          selectedId={selectedConversationId}
        />
      </div>
    </div>
  )
}
