import { IncomingMessage, ServerResponse } from "http";
import * as authController from "./controllers/authController";
import * as userController from "./controllers/userController";
import * as carController from "./controllers/carController";
import * as hackController from "./controllers/hackController";
import { sseHandler } from "./services/sseService";
import { serveStaticFile } from "./utils/helpers";
import path from "path";

const frontendDir = path.join(__dirname, "../frontend");

export const router = (req: IncomingMessage, res: ServerResponse): void => {
  const { method, url } = req;
  if (!url) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Nieprawidłowe żądanie");
    return;
  }

  const requestedPath = url === "/" ? "/index.html" : url;
  const filePath = path.join(frontendDir, requestedPath);
  const fs = require("fs");
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveStaticFile(filePath, res);
    return;
  }

  res.setHeader("Content-Type", "application/json");

  if (url.startsWith("/register") && method === "POST") {
    return authController.register(req, res);
  }

  if (url.startsWith("/login") && method === "POST") {
    return authController.login(req, res);
  }

  if (url === "/logout" && method === "POST") {
    return authController.logout(req, res);
  }

  if (url === "/me" && method === "GET") {
    return authController.me(req, res);
  }

  if (url.startsWith("/users")) {
    const parts = url.split("/");
    const userId = parts[2];
    if (method === "GET") {
      return userController.getUsers(req, res, userId);
    }
    if (method === "POST") {
      return userController.createUser(req, res);
    }
    if (method === "PUT" && userId) {
      return userController.updateUser(req, res, userId);
    }
    if (method === "DELETE" && userId) {
      return userController.deleteUser(req, res, userId);
    }
  }

  if (url.startsWith("/cars") && !url.endsWith("/buy")) {
    const parts = url.split("/");
    const carId = parts[2];
    if (method === "GET") {
      return carController.getCars(res, carId);
    }
    if (method === "POST") {
      return carController.createCar(req, res);
    }
    if (method === "PUT" && carId) {
      return carController.updateCar(req, res, carId);
    }
    if (method === "DELETE" && carId) {
      return carController.deleteCar(req, res, carId);
    }
  }

  if (url === "/events") {
    return sseHandler(req, res);
  }

  if (method === "POST" && url.startsWith("/cars/") && url.endsWith("/buy")) {
    const parts = url.split("/");
    const carId = parts[2];
    return carController.buyCar(req, res, carId);
  }

  if (method === "PUT" && url.startsWith("/hack/fund/10000")) {
    return hackController.hack(req, res);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint nie istnieje" }));
};
