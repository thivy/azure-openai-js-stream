import {
  AzureOpenAIConfiguration,
  CreateChatCompletionRequest,
} from "./models";
import { SSEParser } from "./sse-parser";

export class AzureOpenAI {
  private configuration: AzureOpenAIConfiguration;

  constructor(configuration: AzureOpenAIConfiguration) {
    this.configuration = configuration;
  }

  public async createChatCompletion(
    createChatCompletionRequest: CreateChatCompletionRequest
  ) {
    const chatAPI = `${this.configuration.basePath}/chat/completions?api-version=${this.configuration.chatVersion}`;
    const jsonString = this.stringifyJsonWithoutNulls(
      createChatCompletionRequest
    );

    const response = await fetch(chatAPI, {
      headers: {
        "Content-Type": "application/json",
        "api-key": this.configuration.apiKey,
      },
      method: "POST",
      body: jsonString,
    });

    const stream = this.createStreamFromResponse(response);
    return stream;
  }

  private async processResponse(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    controller: ReadableStreamDefaultController<Uint8Array>
  ) {
    const SSEEvents = {
      onError: (error: any) => {
        controller.error(error);
      },
      onData: (data: string) => {
        const queue = new TextEncoder().encode(data);
        controller.enqueue(queue);
      },
      onComplete: () => {
        controller.close();
      },
    };

    const decoder = new TextDecoder();
    const sseParser = new SSEParser(SSEEvents);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunkValue = decoder.decode(value);
      sseParser.parseSSE(chunkValue);
    }
  }

  private createStreamFromResponse(response: Response) {
    const source: UnderlyingDefaultSource<Uint8Array> = {
      start: async (controller) => {
        if (response && response.body && response.ok) {
          const reader = response.body.getReader();
          try {
            await this.processResponse(reader, controller);
          } catch (e) {
            controller.error(e);
          } finally {
            controller.close();
            reader.releaseLock();
          }
        } else {
          if (!response.ok) {
            controller.error(response.statusText);
          } else {
            controller.error("No response body");
          }
        }
      },
    };

    return new ReadableStream(source);
  }

  private stringifyJsonWithoutNulls(obj: any): string {
    return JSON.stringify(obj, (key, value) => {
      if (value === null || value === undefined) {
        return undefined;
      }
      return value;
    });
  }
}
