export const UserRoleEnum = {
  admin: "admin",
  host: "host",
  member: "member",
};

export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];
