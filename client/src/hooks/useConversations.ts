import { useState, useEffect } from "react"
import type { Conversation } from "../binding"
import { fetchConversations, deleteConversation } from "../binding"
import { REFRESH_CONVERSATIONS_EVENT } from "../App"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await fetchConversations()
      setConversations(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch conversations"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchData()
    
    // Add event listener for refreshing conversations
    window.addEventListener(REFRESH_CONVERSATIONS_EVENT, fetchData)
    
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener(REFRESH_CONVERSATIONS_EVENT, fetchData)
    }
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteConversation(id)
      setConversations(prevConversations => 
        prevConversations.filter(conversation => conversation.id !== id)
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete conversation"))
    }
  }

  return {
    conversations,
    isLoading,
    error,
    refetch: fetchData,
    deleteConversation: handleDelete
  }
}
