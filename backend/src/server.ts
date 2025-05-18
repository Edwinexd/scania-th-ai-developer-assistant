import express from "express";
import cors from "cors";
import ConversationRouter from "./routes/conversations";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/conversations", ConversationRouter);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export default app;
