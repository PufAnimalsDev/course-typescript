import jwt from "jsonwebtoken";
import { loadData } from "./fileService";
import { User } from "../utils/types";
import { IncomingMessage, ServerResponse } from "http";
import { parseCookies } from "../utils/helpers";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined");
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "24h" });
};

export const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    const users = loadData<User>("db/users.json");
    return users.find((user) => user.id === decoded.userId) || null;
  } catch {
    return null;
  }
};

export const setAuthCookie = (res: ServerResponse, token: string): void => {
  res.setHeader(
    "Set-Cookie",
    `authToken=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`
  );
};

export const authenticateUser = (req: IncomingMessage): User | null => {
  const cookies = parseCookies(req);
  const token = cookies["authToken"];
  if (!token) return null;
  return getUserFromToken(token);
};