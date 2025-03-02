import { IncomingMessage, ServerResponse } from "http";
import { generateToken, setAuthCookie, authenticateUser } from "../services/authService";
import { loadData, saveData } from "../services/fileService";
import { generateRandomId } from "../utils/helpers";
import { User, LoginResponse } from "../utils/types";

export const register = (req: IncomingMessage, res: ServerResponse): void => {
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
      const userExists = users.find((user) => user.username === newUser.username);

      if (userExists) {
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

export const login = (req: IncomingMessage, res: ServerResponse): void => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const { username, password } = JSON.parse(body);

      if (!username || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Username i password są wymagane!" }));
        return;
      }

      const users = loadData<User>("db/users.json");
      const user = users.find((user) => user.username === username && user.password === password);

      if (user) {
        const token = generateToken(user.id);
        setAuthCookie(res, token);

        const response: LoginResponse = { message: "Zalogowano pomyślnie", user };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Niepoprawne dane logowania" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};

export const logout = (req: IncomingMessage, res: ServerResponse): void => {
  res.setHeader(
    "Set-Cookie",
    "authToken=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
  );
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Wylogowano" }));
};

export const me = (req: IncomingMessage, res: ServerResponse): void => {
  const user = authenticateUser(req);
  if (user) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
      balance: user.balance,
    }));
  } else {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Brak uprawnień, proszę się zalogować." }));
  }
};