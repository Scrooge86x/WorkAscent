export type UserRole = "admin" | "user";

export type User = {
    userId: string;
    name: string;
    email: string;
    role: UserRole;
};
