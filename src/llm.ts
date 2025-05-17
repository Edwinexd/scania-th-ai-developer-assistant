import  { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";


const model = new ChatMistralAI({
  model: "mistral-large-latest",
});

const BASE_MESSAGES = [
  // TODO: Tell agent not to use markdown as we don't have a renderer for it in this small app
  new SystemMessage("You are a developer assistant that concisely answers a developer's question with assumption of the user having knowledge of programming."),
];

export async function getDevResponse(question: string) {
  const messages = [...BASE_MESSAGES, new HumanMessage(question)];
  return await model.invoke(messages);
}
