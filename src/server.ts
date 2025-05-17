import express from "express";
import ConversationRouter from "./routes/conversations";

const PORT = 3000;

const app = express();

app.use(express.json());

app.use("/conversations", ConversationRouter);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export default app;
