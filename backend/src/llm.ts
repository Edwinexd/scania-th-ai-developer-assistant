import  { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";


const model = new ChatMistralAI({
    model: "mistral-large-latest",
});

const summaryModel = new ChatMistralAI({
    model: "mistral-large-latest",
    maxTokens: 25,
});

const BASE_MESSAGES = [
    // TODO: Tell agent not to use markdown as we don't have a renderer for it 
    new SystemMessage("You are a developer assistant that concisely answers a developer's question with assumption of the user having knowledge of programming."),
];

export async function getDevResponse(question: string) {
    const messages = [...BASE_MESSAGES, new HumanMessage(question)];
    return await model.invoke(messages);
}

export async function getTitle(query: string, response: string) {
    const messages = [
        new SystemMessage("Generate a title for the following conversation, 3 words max, only return the suggested title - nothing else."),
        new HumanMessage(`Query: ${query}\nResponse: ${response}`),
    ];
    return (await summaryModel.invoke(messages)).text;
}
