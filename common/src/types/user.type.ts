import { UserRole } from "../enums/index";

export type User = {
  name: string;
  avatar: string;
  email: string;
  role: UserRole;
  password: string;
};
