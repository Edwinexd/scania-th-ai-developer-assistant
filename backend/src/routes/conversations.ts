import { Router, Request, Response, NextFunction } from "express";
import { addConversation, addMessage, deleteConversation, getConversation, getConversations, getMessages } from "../db";
import { getDevResponse, getTitle } from "../llm";

const router = Router();

interface ConversationRequest extends Request {
    conversation?: any;
    conversationId?: number;
}

// Middleware to fetch conversation by ID and handle 404
async function conversationMiddleware(
    req: ConversationRequest,
    res: Response,
    next: NextFunction
) {
    const conversationId = parseInt(req.params.id, 10);
    if (isNaN(conversationId)) {
        res.status(400).json({ error: "Invalid conversation ID" });
        return;
    }
    const conversation = await getConversation(conversationId);
    if (!conversation) {
        res.status(404).json({ error: "Conversation not found" });
        return;
    }
    req.conversation = conversation;
    req.conversationId = conversationId;
    next();
}

router.get("/", async (_req: Request, res: Response) => {
    res.json({ data: await getConversations() });
});

router.get("/:id", conversationMiddleware, async (req: ConversationRequest, res: Response) => {
    const messages = await getMessages(req.conversationId!);
    res.json({ conversation: req.conversation!, messages });
});

router.delete("/:id", conversationMiddleware, async (req: ConversationRequest, res: Response) => {
    await deleteConversation(req.conversationId!);
    res.status(204).send();
});

router.post("/:id/messages", conversationMiddleware, async (req: ConversationRequest, res: Response) => {
    const { query } = req.body;
    if (!query) {
        res.status(400).json({ error: "Query is required" });
        return;
    }
    const prevMessages = await getMessages(req.conversationId!);
    const response = await getDevResponse(query, prevMessages);
    const message = await addMessage(req.conversationId!, query, response.text);
    res.status(201).json(message);
});

router.post("/", async (req: Request, res: Response) => {
    const { query } = req.body;
    if (!query) {
        res.status(400).json({ error: "Query is required" });
        return;
    }
    const response = await getDevResponse(query);
    const title = await getTitle(query, response.text);
    const conversation = await addConversation(title);
    const message = await addMessage(conversation.id, query, response.text);

    res.status(201).json({ conversation, message });
});

export default router;
