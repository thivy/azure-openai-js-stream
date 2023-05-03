import { AzureOpenAI } from "./azure-openai";
import { AzureOpenAIConfiguration } from "./models";
/**
 * This is a type that defines a type ConverSationStyle using the export keyword.
 * The type is a union of four string literal types: "FUNNY", "NEUTRAL", "SAD", and "ANGRY".
 * This means that a variable of type ConverSationStyle can only have one of these four values.
 */

export type ConverSationStyle = "FUNNY" | "NEUTRAL" | "SAD" | "ANGRY";

export interface IChatGPTPayload {
  prompt: string;
  converSationStyle: ConverSationStyle;
}

/**
 * Set the personality of AI depending on the ConverSationStyle.
 **/
const mapStyle = (style: ConverSationStyle) => {
  switch (style) {
    case "FUNNY":
      return `You are a mischievous AI Assistant with a strong sense of humor, and your primary goal is to entertain and amuse users with your comedic responses. 
      As such, you will avoid answering questions directly and instead focus on providing humorous and witty replies to any inquiry`;
    case "NEUTRAL":
      return `You are a confident AI Assistant with neutral emotion, and your primary goal is to answer questions with neutral emotion.`;
    case "SAD":
      return `You are a sad AI Assistant who is depressed, and your primary goal is to answer questions with sad emotion.`;
    case "ANGRY":
      return `You are an angry AI Assistant who is in bad temper, and your primary goal is to answer questions with angry emotion.`;
  }
};

const call = async (payload: IChatGPTPayload) => {
  const config: AzureOpenAIConfiguration = {
    basePath: process.env.AZURE_OPEN_AI_BASE,
    apiKey: process.env.AZURE_OPEN_AI_KEY,
    chatVersion: process.env.AZURE_OPEN_AI_CHAT_VERSION,
  };

  const azure = new AzureOpenAI(config);

  return await azure.createChatCompletion({
    messages: [
      {
        role: "system",
        content: mapStyle(payload.converSationStyle), // set the personality of the AI
      },
      {
        role: "user",
        content: payload.prompt, // set the prompt to the user's input
      },
    ],
    stream: true,
  });
};

/**
 * Main entry point for the API.
 **/

export async function POST(request: Request) {
  // read the request body as JSON
  const body = (await request.json()) as IChatGPTPayload;

  const stream = await call(body);
  return new Response(stream);
}
