// Conversations API binding for the frontend
// Uses VITE_API_URL env variable for server location


export interface Conversation {
  id: number;
  title: string | null;
  created_at: string; // ISO string from backend
}

export interface Message {
  id: number;
  conversation_id: number;
  query: string;
  response: string | null;
  created_at: string; // ISO string from backend
}

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API_URL}/conversations`);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return (await res.json()).data as Conversation[];
}

export async function fetchConversation(id: number): Promise<{ conversation: Conversation; messages: Message[] }> {
  const res = await fetch(`${API_URL}/conversations/${id}`);
  if (!res.ok) throw new Error("Failed to fetch conversation");
  return await res.json();
}

export async function createConversation(query: string): Promise<{ conversation: Conversation; message: Message }> {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return await res.json();
}

export async function sendMessage(conversationId: number, query: string): Promise<Message> {
  const res = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error("Failed to send message");
  return await res.json();
}

export async function deleteConversation(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/conversations/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete conversation");
}
