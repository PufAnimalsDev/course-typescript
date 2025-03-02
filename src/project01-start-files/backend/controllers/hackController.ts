import { IncomingMessage, ServerResponse } from "http";
import { loadData, saveData } from "../services/fileService";
import { User } from "../utils/types";

export const hack = (req: IncomingMessage, res: ServerResponse): void => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const updatedData: Partial<User> = JSON.parse(body);
      const users = loadData<User>("db/users.json");

      const userIndex = users.findIndex((u) => u.id === updatedData.id);

      if (userIndex === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Użytkownik nie znaleziony" }));
        return;
      }

      users[userIndex].balance += 10000;

      saveData("db/users.json", users);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          id: users[userIndex].id,
          username: users[userIndex].username,
          role: users[userIndex].role,
          balance: users[userIndex].balance,
        })
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};