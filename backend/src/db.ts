import { Pool, PoolClient } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


pool.once("connect", (client: PoolClient) => {
    // Simple DB-layout similar to the one used on ChatGPT, assumes one user
    client.query(`
        CREATE TABLE IF NOT EXISTS conversations (
            id SERIAL PRIMARY KEY,
            title TEXT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            conversation_id INTEGER NOT NULL,
            query TEXT NOT NULL,
            response TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON UPDATE CASCADE ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_conversation_id ON messages (conversation_id);
        CREATE INDEX IF NOT EXISTS idx_created_at ON messages (created_at);
    `).catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Error creating tables:", err);
    });
});

export interface Conversation {
    id: number;
    title: string | null;
    created_at: Date;
}

export interface Message {
    id: number;
    conversation_id: number;
    query: string;
    response: string;
    created_at: Date;
}

export async function getConversations(): Promise<Conversation[]> {
    const res = await pool.query<Conversation>("SELECT * FROM conversations ORDER BY created_at DESC");
    return res.rows;
}

export async function getConversation(conversationId: number): Promise<Conversation | null> {
    const res = await pool.query<Conversation>("SELECT * FROM conversations WHERE id = $1", [conversationId]);
    return res.rows[0] || null;
}

export async function getMessages(conversationId: number): Promise<Message[]> {
    const res = await pool.query<Message>("SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC", [conversationId]);
    return res.rows;
}

export async function addConversation(title: string | null): Promise<Conversation> {
    const res = await pool.query<Conversation>("INSERT INTO conversations (title) VALUES ($1) RETURNING *", [title]);
    return res.rows[0];
}

export async function addMessage(conversationId: number, query: string, response: string): Promise<Message> {
    const res = await pool.query<Message>("INSERT INTO messages (conversation_id, query, response) VALUES ($1, $2, $3) RETURNING *", [conversationId, query, response]);
    return res.rows[0];
}

export async function deleteConversation(conversationId: number): Promise<void> {
    await pool.query("DELETE FROM conversations WHERE id = $1", [conversationId]);
}

