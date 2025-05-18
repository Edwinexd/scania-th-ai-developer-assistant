import { useState, useCallback } from 'react'
import type { Conversation } from './binding'
import { Sidebar } from './components/Sidebar'
import { ConversationDetails } from './components/ConversationDetails'
import { createConversation } from './binding'
import './App.css'

// Define a custom event name
export const REFRESH_CONVERSATIONS_EVENT = 'refresh-conversations'

function App() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isCreatingNewConversation, setIsCreatingNewConversation] = useState(false)

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  const handleCreateNewConversation = async () => {
    setIsCreatingNewConversation(true)
    try {
      const result = await createConversation("")
      setSelectedConversation(result.conversation)
      window.dispatchEvent(new Event(REFRESH_CONVERSATIONS_EVENT))
    } catch (error) {
      console.error("Failed to create new conversation:", error)
    } finally {
      setIsCreatingNewConversation(false)
    }
  }

  const refreshConversations = useCallback(() => {
    // Dispatch a custom event instead of using a state variable
    window.dispatchEvent(new Event(REFRESH_CONVERSATIONS_EVENT))
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        onSelectConversation={handleSelectConversation}
        selectedConversationId={selectedConversation?.id}
        onNewConversation={handleCreateNewConversation}
        isCreatingNewConversation={isCreatingNewConversation}
      />
      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        {selectedConversation ? (
          <ConversationDetails 
            conversation={selectedConversation}
            onRefresh={refreshConversations}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <h2 className="text-2xl font-semibold mb-2">Welcome to the AI Developer Assistant</h2>
              <p className="text-gray-600 mb-4">Select a conversation from the sidebar to get started</p>
              <p className="text-sm text-gray-500">Or create a new conversation using the button in the sidebar</p>
              <button
                onClick={handleCreateNewConversation}
                disabled={isCreatingNewConversation}
                className={`mt-6 px-6 py-3 rounded-lg text-white ${
                  isCreatingNewConversation ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isCreatingNewConversation ? 'Creating...' : 'New Conversation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
