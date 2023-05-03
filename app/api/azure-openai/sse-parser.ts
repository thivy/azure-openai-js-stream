export class SSEParser {
  private controller: ReadableStreamDefaultController;

  constructor(controller: ReadableStreamDefaultController) {
    this.controller = controller;
  }

  public parseSSE(input: string): string {
    let accumulatedData = input;
    let pos = 0;
    let data = "";

    while (pos < accumulatedData.length) {
      const lineEnd = accumulatedData.indexOf("\n", pos);
      if (lineEnd === -1) {
        break;
      }

      const line = accumulatedData.slice(pos, lineEnd).trim();
      pos = lineEnd + 1;

      if (line.startsWith("data:")) {
        const eventData = line.slice(5).trim();

        if (eventData === "[DONE]") {
          this.controller.close();
          break;
        } else {
          data += eventData;
        }
      } else if (line === "") {
        if (data) {
          this.processEvent(data);
          data = "";
        }
      }
    }

    accumulatedData = accumulatedData.slice(pos);
    return accumulatedData;
  }

  private processEvent(data: string): void {
    try {
      const json = JSON.parse(data);
      const text = json.choices[0].delta?.content || "";
      const queue = new TextEncoder().encode(text);
      this.controller.enqueue(queue);
    } catch (e) {
      this.controller.close();
      this.controller.error(e);
    }
  }
}
