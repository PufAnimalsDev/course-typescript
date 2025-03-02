import fs from "fs";
import { IncomingMessage, ServerResponse } from "http";
import path from "path";

export const parseCookies = (req: IncomingMessage): Record<string, string> => {
  const cookieHeader = req.headers.cookie || "";
  return Object.fromEntries(cookieHeader.split("; ").map((c) => c.split("=")));
};

export const getContentType = (ext: string): string => {
  const contentTypes: { [key: string]: string } = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
  };
  return contentTypes[ext] || "application/octet-stream";
};

export const serveStaticFile = (filePath: string, res: ServerResponse): void => {
  const absolutePath = path.resolve(filePath);
  fs.readFile(absolutePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
      return;
    }
    const ext = path.extname(absolutePath);
    res.writeHead(200, { "Content-Type": getContentType(ext) });
    res.end(data);
  });
};

export const generateRandomId = (length: number, name: string): string => {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result + name;
};