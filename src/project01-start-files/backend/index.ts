import http from "http";
import { router } from "./routes";

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});