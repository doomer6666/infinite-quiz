export const UserRoleEnum = {
  admin: "admin",
  host: "host",
  memder: "memder",
};

export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

export type User = {
  name: string;
  avatar: string;
  email: string;
  role: UserRole;
  password: string;
};
