import { useState, useCallback } from "react"
import type { Conversation } from "./binding"
import { Sidebar } from "./components/Sidebar"
import { ConversationDetails } from "./components/ConversationDetails"
import { createConversation } from "./binding"
import { MessageInput } from "./components/MessageInput"
import "./App.css"

// Define a custom event name
export const REFRESH_CONVERSATIONS_EVENT = "refresh-conversations"

function App() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  const handleNavigateToStartScreen = () => {
    // Simply clear the selected conversation to show the welcome screen
    setSelectedConversation(null)
  }

  const refreshConversations = useCallback(() => {
    // Dispatch a custom event instead of using a state variable
    window.dispatchEvent(new Event(REFRESH_CONVERSATIONS_EVENT))
  }, [])

  const handleStartNewChat = async (message: string) => {
    try {
      const result = await createConversation(message)
      setSelectedConversation(result.conversation)
      window.dispatchEvent(new Event(REFRESH_CONVERSATIONS_EVENT))
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to create conversation")
    }
  }
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        onSelectConversation={handleSelectConversation}
        selectedConversationId={selectedConversation?.id}
        onNewConversation={handleNavigateToStartScreen}
      />
      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        {selectedConversation ? (
          <ConversationDetails 
            conversation={selectedConversation}
            onRefresh={refreshConversations}
          />
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6 max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">Welcome to the AI Developer Assistant</h2>
                <p className="text-gray-600 mb-4">Ask me anything about programming, software development, or technical challenges.</p>
                <p className="text-sm text-gray-500 mb-8">You can also select an existing conversation from the sidebar.</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="max-w-3xl mx-auto">
                <MessageInput 
                  onSendMessage={handleStartNewChat}
                  placeholder="Ask me anything..."
                  loadingText="Creating conversation..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
