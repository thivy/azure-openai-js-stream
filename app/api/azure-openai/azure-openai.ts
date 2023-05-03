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
    controller: ReadableStreamDefaultController<string>
  ) {
    const decoder = new TextDecoder();
    let accumulatedData = "";
    const sseParser = new SSEParser(controller);

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        if (accumulatedData) {
          sseParser.parseSSE(accumulatedData);
          accumulatedData = "";
        }
        break;
      }

      const chunkValue = decoder.decode(value, { stream: true });
      accumulatedData = sseParser.parseSSE(chunkValue + accumulatedData);
    }

    controller.close();
    reader.releaseLock();
  }

  private createStreamFromResponse(response: Response) {
    const source: UnderlyingDefaultSource<any> = {
      start: async (controller) => {
        if (response && response.body && response.ok) {
          const reader = response.body.getReader();
          try {
            await this.processResponse(reader, controller);
          } catch (e) {
            controller.error(e);
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
