import { UserRole } from "../enums/index.js";

export type User = {
  name: string;
  avatar: string;
  email: string;
  role: UserRole;
  password: string;
};
