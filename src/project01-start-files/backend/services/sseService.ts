import { IncomingMessage, ServerResponse } from "http";

const clients: Array<ServerResponse> = [];

export const sseHandler = (req: IncomingMessage, res: ServerResponse): void => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  clients.push(res);

  req.on("close", () => {
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
};

export const sendEvent = (event: string, data: object): void => {
  const message = `data: ${JSON.stringify({ event, ...data })}\n\n`;
  clients.forEach((client) => client.write(message));
};