export type AzureOpenAIConfiguration = {
  basePath: string;
  apiKey: string;
  chatVersion?: string;
};

export type ChatCompletionRequestMessageRoleEnum =
  | "system"
  | "user"
  | "assistant";

export interface ChatCompletionRequestMessage {
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
}
export type CreateChatCompletionRequestStop = Array<string> | string;

export type CreateChatCompletionRequest = {
  messages: Array<ChatCompletionRequestMessage>;
  temperature?: number | null;
  top_p?: number | null;
  n?: number | null;
  stream?: boolean | null;
  stop?: CreateChatCompletionRequestStop;
  max_tokens?: number;
  presence_penalty?: number | null;
  frequency_penalty?: number | null;
  logit_bias?: object | null;
  user?: string;
};
