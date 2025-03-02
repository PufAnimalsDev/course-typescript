export interface User {
    id: string; // immutable
    username: string;
    password: string; // dla uproszczenia hasło jawne – w praktyce należy hashować
    role: "admin" | "user"; // immutable
    balance: number; // immutable
  }
  
  export interface Car {
    id: string;
    model: string;
    price: number;
    ownerId: string;
  }
  
  export interface LoginResponse {
    message: string;
    user: User;
  }