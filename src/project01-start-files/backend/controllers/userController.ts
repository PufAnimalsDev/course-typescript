import { IncomingMessage, ServerResponse } from "http";
import { loadData, saveData } from "../services/fileService";
import { authenticateUser } from "../services/authService";
import { generateRandomId } from "../utils/helpers";
import { User } from "../utils/types";

export const getUsers = (req: IncomingMessage, res: ServerResponse, userId?: string): void => {
  const user = authenticateUser(req);
  if (!user) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Brak uprawnień, proszę się zalogować." }));
    return;
  }

  const users = loadData<User>("db/users.json");
  if (!userId) {
    const userList = users.map((u) => ({
      id: u.id,
      username: u.username,
      role: u.role,
      balance: u.balance,
    }));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(userList));
  } else {
    const foundUser = users.find((u) => u.id === userId);
    if (foundUser) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        balance: foundUser.balance,
      }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Użytkownik nie znaleziony" }));
    }
  }
};

export const createUser = (req: IncomingMessage, res: ServerResponse): void => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const newUser: User = JSON.parse(body);
      if (!newUser.username || !newUser.password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Username i password są wymagane!" }));
        return;
      }

      const users = loadData<User>("db/users.json");
      if (users.find((u) => u.username === newUser.username)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Użytkownik o tym loginie już istnieje" }));
        return;
      }

      newUser.id = generateRandomId(10, newUser.username);
      newUser.role = "user";
      newUser.balance = 0;
      users.push(newUser);
      saveData("db/users.json", users);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};

export const updateUser = (req: IncomingMessage, res: ServerResponse, userId: string): void => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const updatedData: Partial<User> = JSON.parse(body);
      const users = loadData<User>("db/users.json");
      const index = users.findIndex((u) => u.id === userId);
      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Użytkownik nie znaleziony" }));
        return;
      }

      users[index] = { ...users[index], ...updatedData };
      saveData("db/users.json", users);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        id: users[index].id,
        username: users[index].username,
        role: users[index].role,
        balance: users[index].balance,
      }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};

export const deleteUser = (req: IncomingMessage, res: ServerResponse, userId: string): void => {
  try {
    const users = loadData<User>("db/users.json");
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Użytkownik nie znaleziony" }));
      return;
    }

    users.splice(index, 1);
    saveData("db/users.json", users);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Użytkownik usunięty" }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};