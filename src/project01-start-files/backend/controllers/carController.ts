import { IncomingMessage, ServerResponse } from "http";
import { loadData, saveData } from "../services/fileService";
import { generateRandomId } from "../utils/helpers";
import { Car, User } from "../utils/types";
import { sendEvent } from "../services/sseService";

export const getCars = (res: ServerResponse, carId?: string): void => {
  const cars = loadData<Car>("db/cars.json");
  if (!carId) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(cars));
  } else {
    const car = cars.find(c => c.id === carId);
    if (car) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(car));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Samochód nie znaleziony" }));
    }
  }
};

export const createCar = (req: IncomingMessage, res: ServerResponse): void => {
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try {
      const newCar: Car = JSON.parse(body);
      if (!newCar.model || !newCar.price || !newCar.ownerId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Model, price, ownerId są wymagane!" }));
        return;
      }

      const users = loadData<User>("db/users.json");
      if (!users.some(u => u.id === newCar.ownerId)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Użytkownik o podanym id nie istnieje!" }));
        return;
      }

      const cars = loadData<Car>("db/cars.json");
      newCar.id = generateRandomId(10, newCar.model);
      cars.push(newCar);
      saveData("db/cars.json", cars);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newCar));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};

export const updateCar = (req: IncomingMessage, res: ServerResponse, carId: string): void => {
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try {
      const updatedData: Partial<Car> = JSON.parse(body);
      const cars = loadData<Car>("db/cars.json");
      const index = cars.findIndex(c => c.id === carId);
      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Samochód nie znaleziony" }));
        return;
      }

      cars[index] = { ...cars[index], ...updatedData };
      saveData("db/cars.json", cars);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(cars[index]));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};

export const deleteCar = (req: IncomingMessage, res: ServerResponse, carId: string): void => {
  try {
    const cars = loadData<Car>("db/cars.json");
    const index = cars.findIndex(c => c.id === carId);
    if (index === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Samochód nie znaleziony" }));
      return;
    }

    cars.splice(index, 1);
    saveData("db/cars.json", cars);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Samochód usunięty" }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

export const buyCar = (req: IncomingMessage, res: ServerResponse, carId: string): void => {
  let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const { buyerId } = JSON.parse(body);
      const cars = loadData<Car>("db/cars.json");
      const users = loadData<User>("db/users.json");

      const car = cars.find(c => c.id === carId);
      if (!car) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Samochód nie istnieje." }));
        return;
      }

      if (buyerId === car.ownerId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Nie możesz kupić własnego samochodu." }));
        return;
      }

      const buyer = users.find(u => u.id === buyerId);
      const owner = users.find(u => u.id === car.ownerId);
      if (!buyer) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Użytkownik nie istnieje." }));
        return;
      }

      if (buyer.balance < car.price) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Niewystarczające saldo." }));
        return;
      }

      buyer.balance -= car.price;
      if (owner) owner.balance += car.price;

      const newCars = cars.filter(c => c.id !== carId);

      saveData("db/users.json", users);
      saveData("db/cars.json", newCars);

      sendEvent("car_purchased", { carId, buyerId });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Zakup udany.", newBalance: buyer.balance }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};