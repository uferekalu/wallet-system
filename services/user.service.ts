import { CreateUser, User, UserData } from "../types/user-interface";
import bcrypt from "bcryptjs";
import db from "../config/db";

const createUser = async (userInfo: CreateUser) => {
  const { first_name, last_name, email, password } = userInfo;

  const hashPassword = bcrypt.hashSync(password, 12);

  const user = await db("users").insert({
    first_name,
    last_name,
    email,
    password: hashPassword,
  });

  return user;
};

const findUserByEmail = async (email: string) => {
  const user = await db.select("*").from("users").where("email", email).first();
  return user;
};

const getProfile = async (userData: UserData): Promise<User> => {
  const user = await findUserByEmail(userData.email);
  delete user.password;
  return user;
};

export { createUser, findUserByEmail, getProfile };
