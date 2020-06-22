import { Role } from "./Role"

export class User{
    userId: number //Primary Key
    username: string //Unique
    password: string
    firstName: string
    lastName: string
    email: string
    role: Role
  }