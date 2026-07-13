export const UserRoleEnum = {
  admin: "admin",
  host: "host",
  memder: "memder",
};

export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];
