import { Request } from "express";

export interface CreateUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
}

export type UserData = Omit<User, "password">;

export interface IReqAuth extends Request {
  user?: UserData;
}
