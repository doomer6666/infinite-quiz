import { UserRole } from "../dto/user/user-role.enum";

export type User = {
  name: string;
  avatar: string;
  email: string;
  role: UserRole;
  password: string;
};
